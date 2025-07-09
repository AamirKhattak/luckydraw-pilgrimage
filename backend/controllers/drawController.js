const { Op } = require("sequelize");
const {
  DrawType,
  DrawResult,
  Employee,
  RandomLog,
} = require("../models");

const generateRandomNumber = () =>
  Math.floor(100000 + Math.random() * 400000).toString();

exports.runDraw = async (req, res) => {
  const { drawType, winners, waiting, year } = req.body;

  if (!drawType || !winners || !waiting || !year) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // const existingDraw = await DrawType.findOne({
    //   where: { type: drawType, year },
    // });

    // if (existingDraw) {
    //   return res.status(400).json({
    //     error: `A '${drawType}' draw for year ${year} has already been conducted.`,
    //   });
    // }

    const drawEntry = await DrawType.create({
      type: drawType,
      year,
      winners,
      waiting,
    });

    let excludeEmployeeIds = [];
    if (drawType === "umrah") {
      const priorHajjWinners = await DrawResult.findAll({
        include: [
          { model: DrawType, where: { type: "hajj" } },
          { model: Employee },
        ],
        where: { status: "winner" },
      });
      excludeEmployeeIds = priorHajjWinners.map((r) => r.employee_id);
    }

    const whereClause = { data_for: drawType };
    if (excludeEmployeeIds.length > 0) {
      whereClause.id = { [Op.notIn]: excludeEmployeeIds };
    }

    const eligible = await Employee.findAll({ where: whereClause });

    if (eligible.length < winners + waiting) {
      return res.status(400).json({ error: "Not enough eligible employees." });
    }

    const employeeMap = new Map();
    eligible.forEach((emp) => {
      employeeMap.set(emp.employee_number, emp);
    });

    const selected = [];
    const logs = [];
    const usedIds = new Set();
    let i = 0;

    while (selected.length < winners + waiting && i < 100000) {
      const rand = generateRandomNumber();
      const match = employeeMap.get(rand);

      logs.push({
        draw_type_id: drawEntry.id,
        generated_number: rand,
        matched_employee: !!match,
        matched_employee_id: match ? match.id : null,
      });

      if (match && !usedIds.has(match.id)) {
        selected.push({
          draw_type_id: drawEntry.id,
          employee_id: match.id,
          status: selected.length < winners ? "winner" : "waiting",
          position: selected.length + 1,
          random_number_used: rand,
        });
        usedIds.add(match.id);
      }

      i++;
    }

    if (i >= 100000 && selected.length < winners + waiting) {
      console.warn("⚠️ Max attempts reached without selecting enough employees.");
    }

    await RandomLog.bulkCreate(logs);
    const results = await DrawResult.bulkCreate(selected, { returning: true });

    const final = await Promise.all(
      results.map(async (r) => {
        const emp = await Employee.findByPk(r.employee_id);
        return { ...r.toJSON(), employee: emp };
      })
    );

    res.status(200).json({ draw_id: drawEntry.id, results: final });
  } catch (error) {
    console.error("Draw error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDrawResults = async (req, res) => {
  const { id } = req.params;

  try {
    const results = await DrawResult.findAll({
      where: { draw_type_id: id },
      include: [Employee],
      order: [["position", "ASC"]],
    });

    if (!results.length) {
      return res.status(404).json({ error: "No results found for this draw ID." });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
