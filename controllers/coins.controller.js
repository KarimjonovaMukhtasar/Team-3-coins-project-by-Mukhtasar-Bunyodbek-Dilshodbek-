//  Muxtasar
import pool from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from coins`
        const allCoins = await pool.query(query)
        return res.status(200).json({
            message: `G'aznadagi barcha boyliklar:`,
            coins: allCoins.rows
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
        const coin = await pool.query(`Select * from coins where id = $1`, [id])
        if (coin.rows.length === 0) {
            return res.status(404).json({
                message: `Bu ID raqamdagi tanga mavjud emas!`,
                id: id
            })
        }
        res.status(200).json({
            message: `Qidirilayotgan tanga topildi, Mana:`,
            coin: coin.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const createOne = async (req, res) => {
    try {
        // name varchar not null,
        // country varchar,
        // year SMALLINT,
        // material varchar,
        // value varchar,
        const { name, country, year, material, value } = req.body
        if (!name || !country || !year || !material || !value) {
            return res.status(401).json({ message: `Tanganing barcha ma'lumotlarini to'ldirishingiz kerak!` })
        }
        const values = [name, country, year, material, value]
        const query = `Insert into coins (name, country, year, material, value) VALUES ($1, $2, $3, $4, $5) returning *`
        const newCoin = await pool.query(query, values)
        if (newCoin.rows.length === 0) {
            return res.status(401).json({ message: `Yaratishda xatolik yuz berdi` })
        }
        return res.status(201).json({
            message: `Yangi tanga muvaffaqiyatli yaratildi`,
            newCoin: newCoin.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}

const updateOne = async (req, res) => {
    try {
        const { id } = req.params
        const coinId = await pool.query(`Select * from coins where id = $1 `, [id])
        if (coinId.rows.length === 0) {
            return res.status(404).json({
                message: `Bunday ID raqamdagi tanga topilmadi!`,
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
        const query = `Update coins set ${fields.join(" , ")} where id = $${idx} returning *`
        const updatedCoin = await pool.query(query, values)
        if (updatedCoin.rows.length === 0) {
            return res.status(401).json({ message: `Yangilashda xatolik!` })
        }
        return res.status(200).json({
            message: `Tanga ma'lumoti muvaffaqiyatli yangilandi!`,
            updatedCoin: updatedCoin.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const deleteOne = async (req, res) => {
    try {
        const {id} = req.params
        const coinId = await pool.query(`Select * from coins where id = $1`, [id])
        if(coinId.rows.length === 0){
            return res.status(404).json({message: `Bunday ID raqamdagi tanga topilmadi!`,
                id: id
            })
        }
        const deleted = await pool.query(`Drop from coins where id = $1`, [id])
        if(deleted.rows.length === 0){
            return res.status(401).json(`O'chirishda xatolik sodir bo'ldi!`)
        }
        return res.status(200).json({message: `Tanga muvaffaqiyatli o'chirildi`,
            deletedCoin: deleted.rows[0]
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const search = async (req, res) => {
    try{
        const keys = Object.keys(req.query)
        const values = Object.values(req.query)
        if(keys.length === 0 || values.length === 0){
           return res.status(401).json({message: `Hech qanday qidiruv amaliyoti bajarilmadi!`})
        }
        const Keys= keys.map((key,i)=> `${key} ILIKE $${i+1}`)
        const Values = values.map(v=> `%${v}%`)
        const query = `Select * from coins where ${Keys.join(" or ")}`
        const result = await pool.query(query, Values)
        if(result.rows.length === 0){
            return res.status(404).json({message: `Not found any results for this search`})
        }
        return res.status(200).json({message: result.rows})
    } catch (error) {
         console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, search }