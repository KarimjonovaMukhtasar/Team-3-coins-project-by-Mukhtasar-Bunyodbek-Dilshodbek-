import pool from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const { page = 1, limit = 10} = req.query
        const offset = (page-1)*limit
        const query = `Select * from tags OFFSET $1 LIMIT $2`
        const alltags = await pool.query(query, [offset, limit])
        return res.status(200).json({
            message: `BARCHA MAVJUD TAGLAR:`,
            tags: alltags.rows
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
        const tag = await pool.query(`Select * from tags where id = $1`, [id])
        if (tag.rows.length === 0) {
            return res.status(404).json({
                message: `Bu ID raqamdagi tag mavjud emas!`,
                id: id
            })
        }
        res.status(200).json({
            message: `Qidirilayotgan tag topildi, Mana:`,
            tag: tag.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const createOne = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).json({ message: `Tagning barcha ma'lumotlarini to'ldirishingiz kerak!` })
        }
        const query = `Insert into tags (name) VALUES ($1) returning *`
        const newtag = await pool.query(query, [name])
        if (newtag.rows.length === 0) {
            return res.status(401).json({ message: `Yaratishda xatolik yuz berdi` })
        }
        return res.status(201).json({
            message: `Yangi tag muvaffaqiyatli yaratildi`,
            newtag: newtag.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}

const updateOne = async (req, res) => {
    try {
        const { id } = req.params
        const tagId = await pool.query(`Select * from tags where id = $1 `, [id])
        if (tagId.rows.length === 0) {
            return res.status(404).json({
                message: `Bunday ID raqamdagi tag topilmadi!`,
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
        const query = `Update tags set ${fields.join(" , ")} where id = $${idx} returning *`
        const updatedtag = await pool.query(query, values)
        if (updatedtag.rows.length === 0) {
            return res.status(401).json({ message: `Yangilashda xatolik!` })
        }
        return res.status(200).json({
            message: `Tag ma'lumoti muvaffaqiyatli yangilandi!`,
            updatedtag: updatedtag.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const deleteOne = async (req, res) => {
    try {
        const {id} = req.params
        const tagId = await pool.query(`Select * from tags where id = $1`, [id])
        if(tagId.rows.length === 0){
            return res.status(404).json({message: `Bunday ID raqamdagi tag topilmadi!`,
                id: id
            })
        }
        const deleted = await pool.query(`Drop from tags where id = $1`, [id])
        if(deleted.rows.length === 0){
            return res.status(401).json(`O'chirishda xatolik sodir bo'ldi!`)
        }
        return res.status(200).json({message: `tag muvaffaqiyatli o'chirildi`,
            deletedtag: deleted.rows[0]
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
        const query = `Select * from tags where ${Keys.join(" or ")}`
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