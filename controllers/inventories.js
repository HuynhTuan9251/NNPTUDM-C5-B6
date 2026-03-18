let inventoryModel = require('../schemas/inventories')

module.exports = {

    // ===== Tạo inventory mới (tự động khi tạo product) =====
    CreateInventory: async function (productId) {
        try {
            let newInventory = new inventoryModel({
                product: productId,
                stock: 0,
                reserved: 0,
                soldCount: 0
            })
            await newInventory.save()
            return newInventory
        } catch (error) {
            throw new Error("Failed to create inventory: " + error.message)
        }
    },

    // ===== Lấy tất cả inventory =====
    GetAllInventories: async function () {
        try {
            return await inventoryModel.find()
                .populate({
                    path: 'product',
                    select: 'title price description images'
                })
        } catch (error) {
            throw new Error("Failed to get inventories: " + error.message)
        }
    },

    // ===== Lấy inventory theo ID (join với product) =====
    GetInventoryById: async function (id) {
        try {
            let inventory = await inventoryModel.findById(id)
                .populate({
                    path: 'product',
                    select: 'title price description images category'
                })
            if (!inventory) {
                throw new Error("Inventory not found")
            }
            return inventory
        } catch (error) {
            throw new Error("Failed to get inventory: " + error.message)
        }
    },

    // ===== Lấy inventory theo product ID =====
    GetInventoryByProductId: async function (productId) {
        try {
            let inventory = await inventoryModel.findOne({ product: productId })
                .populate({
                    path: 'product',
                    select: 'title price description images category'
                })
            if (!inventory) {
                throw new Error("Inventory not found for this product")
            }
            return inventory
        } catch (error) {
            throw new Error("Failed to get inventory: " + error.message)
        }
    },

    // ===== Tăng stock =====
    AddStock: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0")
            }
            let inventory = await inventoryModel.findOne({ product: productId })
            if (!inventory) {
                throw new Error("Inventory not found for this product")
            }
            inventory.stock += quantity
            await inventory.save()
            return inventory
        } catch (error) {
            throw new Error("Failed to add stock: " + error.message)
        }
    },

    // ===== Giảm stock =====
    RemoveStock: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0")
            }
            let inventory = await inventoryModel.findOne({ product: productId })
            if (!inventory) {
                throw new Error("Inventory not found for this product")
            }
            if (inventory.stock < quantity) {
                throw new Error("Stock is insufficient")
            }
            inventory.stock -= quantity
            await inventory.save()
            return inventory
        } catch (error) {
            throw new Error("Failed to remove stock: " + error.message)
        }
    },

    // ===== Đặt hàng (giảm stock, tăng reserved) =====
    Reservation: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0")
            }
            let inventory = await inventoryModel.findOne({ product: productId })
            if (!inventory) {
                throw new Error("Inventory not found for this product")
            }
            if (inventory.stock < quantity) {
                throw new Error("Stock is insufficient for reservation")
            }
            inventory.stock -= quantity
            inventory.reserved += quantity
            await inventory.save()
            return inventory
        } catch (error) {
            throw new Error("Failed to reserve: " + error.message)
        }
    },

    // ===== Xác nhận đơn hàng (giảm reserved, tăng soldCount) =====
    Sold: async function (productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error("Quantity must be greater than 0")
            }
            let inventory = await inventoryModel.findOne({ product: productId })
            if (!inventory) {
                throw new Error("Inventory not found for this product")
            }
            if (inventory.reserved < quantity) {
                throw new Error("Reserved quantity is insufficient")
            }
            inventory.reserved -= quantity
            inventory.soldCount += quantity
            await inventory.save()
            return inventory
        } catch (error) {
            throw new Error("Failed to confirm sale: " + error.message)
        }
    }
}
