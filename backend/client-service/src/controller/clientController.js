const service = require("../services/clientService");

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAllClients();
    res.json(data);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Failed to fetch clients' });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getClientById(req.params.id);
    if (!data) return res.status(404).json({ message: "Client not found" });
    res.json(data);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Failed to fetch client' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, poc_name, poc_email } = req.body;
    
    // Basic validation
    if (!name || !poc_name || !poc_email) {
      return res.status(400).json({ 
        message: "Name, POC name, and POC email are required" 
      });
    }

    const created = await service.createClient(req.body);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Failed to create client' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, poc_name, poc_email } = req.body;
    
    // Basic validation
    if (!name || !poc_name || !poc_email) {
      return res.status(400).json({ 
        message: "Name, POC name, and POC email are required" 
      });
    }

    const updated = await service.updateClient(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Failed to update client' });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await service.deleteClient(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Failed to delete client' });
  }
};
