import { describe, it, expect, beforeEach } from 'vitest';

// Mock implementation for testing
const mockEquipmentRegistry = {
  lastEquipmentId: 0,
  equipmentRegistry: new Map(),
  
  registerEquipment(name, description, condition, manufacturer, manufacturingDate, sender) {
    const newId = ++this.lastEquipmentId;
    const currentTime = Date.now();
    
    this.equipmentRegistry.set(newId, {
      name,
      description,
      condition,
      manufacturer,
      manufacturingDate,
      donorId: sender,
      recipientId: null,
      status: "registered",
      registrationDate: currentTime,
      lastUpdated: currentTime
    });
    
    return { ok: newId };
  },
  
  getEquipment(equipmentId) {
    const equipment = this.equipmentRegistry.get(equipmentId);
    return equipment ? { ok: equipment } : { err: 404 };
  },
  
  updateEquipmentStatus(equipmentId, newStatus, sender) {
    const equipment = this.equipmentRegistry.get(equipmentId);
    if (!equipment) return { err: 404 };
    if (equipment.donorId !== sender) return { err: 403 };
    
    equipment.status = newStatus;
    equipment.lastUpdated = Date.now();
    this.equipmentRegistry.set(equipmentId, equipment);
    
    return { ok: true };
  },
  
  assignRecipient(equipmentId, recipient, sender) {
    const equipment = this.equipmentRegistry.get(equipmentId);
    if (!equipment) return { err: 404 };
    if (equipment.donorId !== sender) return { err: 403 };
    if (equipment.status !== "verified") return { err: 400 };
    
    equipment.recipientId = recipient;
    equipment.status = "assigned";
    equipment.lastUpdated = Date.now();
    this.equipmentRegistry.set(equipmentId, equipment);
    
    return { ok: true };
  }
};

describe('Equipment Registry Contract', () => {
  beforeEach(() => {
    // Reset the mock state
    mockEquipmentRegistry.lastEquipmentId = 0;
    mockEquipmentRegistry.equipmentRegistry = new Map();
  });
  
  it('should register new equipment', () => {
    const result = mockEquipmentRegistry.registerEquipment(
        "Ventilator",
        "Medical grade ventilator for ICU",
        "New",
        "MedTech Inc",
        20230101,
        "donor1"
    );
    
    expect(result.ok).toBe(1);
    
    const equipment = mockEquipmentRegistry.getEquipment(1);
    expect(equipment.ok).toBeDefined();
    expect(equipment.ok.name).toBe("Ventilator");
    expect(equipment.ok.status).toBe("registered");
  });
  
  it('should update equipment status', () => {
    mockEquipmentRegistry.registerEquipment(
        "Ventilator",
        "Medical grade ventilator for ICU",
        "New",
        "MedTech Inc",
        20230101,
        "donor1"
    );
    
    const result = mockEquipmentRegistry.updateEquipmentStatus(1, "verified", "donor1");
    expect(result.ok).toBe(true);
    
    const equipment = mockEquipmentRegistry.getEquipment(1);
    expect(equipment.ok.status).toBe("verified");
  });
  
  it('should not allow unauthorized status updates', () => {
    mockEquipmentRegistry.registerEquipment(
        "Ventilator",
        "Medical grade ventilator for ICU",
        "New",
        "MedTech Inc",
        20230101,
        "donor1"
    );
    
    const result = mockEquipmentRegistry.updateEquipmentStatus(1, "verified", "unauthorized");
    expect(result.err).toBe(403);
  });
  
  it('should assign recipient to verified equipment', () => {
    mockEquipmentRegistry.registerEquipment(
        "Ventilator",
        "Medical grade ventilator for ICU",
        "New",
        "MedTech Inc",
        20230101,
        "donor1"
    );
    
    mockEquipmentRegistry.updateEquipmentStatus(1, "verified", "donor1");
    
    const result = mockEquipmentRegistry.assignRecipient(1, "hospital1", "donor1");
    expect(result.ok).toBe(true);
    
    const equipment = mockEquipmentRegistry.getEquipment(1);
    expect(equipment.ok.recipientId).toBe("hospital1");
    expect(equipment.ok.status).toBe("assigned");
  });
  
  it('should not assign recipient to unverified equipment', () => {
    mockEquipmentRegistry.registerEquipment(
        "Ventilator",
        "Medical grade ventilator for ICU",
        "New",
        "MedTech Inc",
        20230101,
        "donor1"
    );
    
    const result = mockEquipmentRegistry.assignRecipient(1, "hospital1", "donor1");
    expect(result.err).toBe(400);
  });
});
