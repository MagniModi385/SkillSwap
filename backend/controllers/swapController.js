// backend/controllers/swapController.js
const Swap = require("../models/Swap");

exports.createSwap = async (req, res) => {
  try {
    const { responder, skillOffered, skillRequested } = req.body;
    const newSwap = new Swap({
      requester: req.userId,
      responder,
      skillOffered,
      skillRequested,
    });
    const saved = await newSwap.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.userId }, { responder: req.userId }],
    })
      .populate("requester", "name email")
      .populate("responder", "name email")
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSwapStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const swap = await Swap.findById(req.params.id);

    if (!swap) return res.status(404).json({ message: "Swap not found" });

    // Only responder can update status
    if (swap.responder.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    swap.status = status;
    const updated = await swap.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
