const Service = require('../models/Service');

// Create a service
exports.createService = async (req, res) => {
  try {
    const { servicename, fee, description } = req.body;

    // Validate required fields
    if (!servicename || !fee || !description) {
      return res.status(400).json({ message: "All fields (name, fee, description) are required." });
    }

    const service = new Service({ servicename, fee, description });
    await service.save();

    res.status(201).json({ message: "Service created successfully.", service });
  } catch (error) {
    res.status(500).json({ message: "Error creating service", error });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service", error });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicename, fee, description } = req.body;

    // Validate required fields
    if (!servicename || !fee || !description) {
      return res.status(400).json({ message: "All fields (name, fee, description) are required." });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { servicename, fee, description },
      { new: true, runValidators: true } // Return updated service and validate inputs
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ message: "Service updated successfully.", service });
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
};
