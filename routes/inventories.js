var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventories')

// ===== Lấy tất cả inventory =====
router.get('/', async function (req, res) {
    try {
        let data = await inventoryController.GetAllInventories()
        res.send(data)
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

// ===== Lấy inventory theo ID =====
router.get('/:id', async function (req, res) {
    try {
        let id = req.params.id
        let data = await inventoryController.GetInventoryById(id)
        res.send(data)
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

// ===== Tăng stock =====
router.post('/add-stock', async function (req, res) {
    try {
        let { product, quantity } = req.body
        if (!product || !quantity) {
            return res.status(400).send({
                message: "Missing product or quantity"
            })
        }
        let result = await inventoryController.AddStock(product, quantity)
        res.send({
            success: true,
            message: "Stock added successfully",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

// ===== Giảm stock =====
router.post('/remove-stock', async function (req, res) {
    try {
        let { product, quantity } = req.body
        if (!product || !quantity) {
            return res.status(400).send({
                message: "Missing product or quantity"
            })
        }
        let result = await inventoryController.RemoveStock(product, quantity)
        res.send({
            success: true,
            message: "Stock removed successfully",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

// ===== Đặt hàng (Reservation) =====
router.post('/reservation', async function (req, res) {
    try {
        let { product, quantity } = req.body
        if (!product || !quantity) {
            return res.status(400).send({
                message: "Missing product or quantity"
            })
        }
        let result = await inventoryController.Reservation(product, quantity)
        res.send({
            success: true,
            message: "Reservation created successfully",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

// ===== Xác nhận đơn hàng (Sold) =====
router.post('/sold', async function (req, res) {
    try {
        let { product, quantity } = req.body
        if (!product || !quantity) {
            return res.status(400).send({
                message: "Missing product or quantity"
            })
        }
        let result = await inventoryController.Sold(product, quantity)
        res.send({
            success: true,
            message: "Sale confirmed successfully",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

module.exports = router
