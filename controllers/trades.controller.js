// Muxtasar
import pool from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from trades`
        const allTrades = await pool.query(query)
        return res.status(200).json({
            message: `Savdolar hammasi:`,
            trades: allTrades.rows
        }
        )
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const findOne = async (req, res) => {
    try {
        const { id } = req.params
        const trade = await pool.query(`Select * from trades where id = $1`, [id])
        if (trade.rows.length === 0) {
            return res.status(404).json({
                message: `Bu ID raqamdagi savdo mavjud emas!`,
                id: id
            })
        }
        return res.status(200).json({
            message: `Qidirilayotgan savdo bitimi topildi, Mana:`,
            trade: trade.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const createOne = async (req, res) => {
    try {
        // from_user_id int REFERENCES users(id),
        // to_user_id int REFERENCES users(id),
        // coin_id int REFERENCES coins(id),
        // status trade_status default 'Pending',
        const { from_user_id, to_user_id, coin_id, status } = req.body
        if (!from_user_id || !to_user_id || !coin_id || !status) {
            return res.status(401).json({ message: `Savdo bitimining barcha ma'lumotlarini to'ldirishingiz kerak!` })
        }
        const checkCustomerId = await pool.query(`Select * from users where id = $1`, [to_user_id])
        if (checkCustomerId.rows.length === 0) {
            return res.status(404).json({
                message: `Bu ID raqamdagi Foydalanuvchi  mavjud emas!`,
                id: to_user_id
            })
        }
        const checkSellerId = await pool.query(`Select * from users where id = $1`, [from_user_id])
        if (checkSellerId.rows.length === 0) {
            return res.status(404).json({
                message: `Bu ID raqamdagi Foydalanuvchi  mavjud emas!`,
                id: from_user_id
            })
        }
        const values = [from_user_id, to_user_id, coin_id, status]
        const query = `Insert into trades (from_user_id, to_user_id, coin_id, status) VALUES ($1, $2, $3, $4) returning *`
        const newTrade = await pool.query(query, values)
        if (newTrade.rows.length === 0) {
            return res.status(401).json({ message: `Yaratishda xatolik yuz berdi` })
        }
        return res.status(201).json({
            message: `Yangi savdo bitimi muvaffaqiyatli yaratildi`,
            newTrade: newTrade.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const updateOne = async (req, res) => {
    try {
        const { id } = req.params
        const tradeId = await pool.query(`Select * from trades where id = $1 `, [id])
        if (tradeId.rows.length === 0) {
            return res.status(404).json({
                message: `Bunday ID raqamdagi savdo bitimi topilmadi!`,
                id: id
            })
        }
        const fields = []
        const values = []
        let idx = 1
        for (const [key, value] of Object.entries(req.body)) {
            fields.push(`${key} = $${idx}`)
            values.push(value)
            idx++
        }
        if (fields.length === 0) {
            return res.status(401).json({ message: `O'zgartirish uchun ma'lumot yuborilmadi!` })
        }
        values.push(id)
        const query = `Update trades set ${fields.join(" , ")} where id = $${idx} returning *`
        const updatedTrade = await pool.query(query, values)
        if (updatedTrade.rows.length === 0) {
            return res.status(401).json({ message: `Yangilashda xatolik!` })
        }
        return res.status(200).json({
            message: `Savdo bitimi ma'lumoti muvaffaqiyatli yangilandi!`,
            updatedTrade: updatedTrade.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const deleteOne = async (req, res) => {
    try {
        const { id } = req.params
        const tradeId = await pool.query(`Select * from trades where id = $1`, [id])
        if (tradeId.rows.length === 0) {
            return res.status(404).json({
                message: `Bunday ID raqamdagi savdo bitimi topilmadi!`,
                id: id
            })
        }
        const deleted = await pool.query(`Drop from trades where id = $1`, [id])
        if (deleted.rows.length === 0) {
            return res.status(401).json(`O'chirishda xatolik sodir bo'ldi!`)
        }
        return res.status(200).json({
            message: `Savdo bitimi muvaffaqiyatli o'chirildi`,
            deletedTrade: deleted.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const search = async (req, res) => {
    try {
        const keys = Object.keys(req.query)
        const values = Object.values(req.query)
        if (keys.length === 0 || values.length === 0) {
            return res.status(401).json({ message: `Hech qanday qidiruv amaliyoti bajarilmadi!` })
        }
        const Keys = keys.map((key, i) => `${key}::text ILIKE $${i + 1}` )
        const Values = values.map(v => `%${v}%`)
        const query = `Select * from trades where ${Keys.join(" and  ")}`
        const result = await pool.query(query, Values)
        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Not found any results for this search` })
        }
        return res.status(200).json({ message: result.rows })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, search }