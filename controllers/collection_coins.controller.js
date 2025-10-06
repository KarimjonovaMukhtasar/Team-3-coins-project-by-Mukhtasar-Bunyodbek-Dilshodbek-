//  Muxtasar
import pool from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from collection_coins`
        const allCollectionCoins = await pool.query(query)
        return res.status(200).json({
            message: `Kolleksiyadagi barcha tangalar:`,
            CollectionCoins: allCollectionCoins.rows
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
        const collectionCoin = await pool.query(`Select * from collection_coins where id = $1`, [id])
        if (collectionCoin.rows.length === 0) {
            return res.status(404).json({
                message: `Bu ID raqamdagi kolleksiya mavjud emas!`,
                id: id
            })
        }
        res.status(200).json({
            message: `Qidirilayotgan kolleksiya topildi, Mana:`,
            collectionCoin: collectionCoin.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const createOne = async (req, res) => {
    try {
        // collections_id int REFERENCES collections(id) on delete cascade,
        // coin_id int REFERENCES coins(id) on delete cascade,
        // condition varchar,
        // note varchar,
        const { collections_id, coin_id , condition, note } = req.body
        if (!collections_id || !coin_id || !condition || !note) {
            return res.status(401).json({ message: `Tanga kolleksiyasining barcha ma'lumotlarini to'ldirishingiz kerak!` })
        }
        const checkCoinId = await pool.query(`Select * from coins where id = $1`, [coin_id])
        if(checkCoinId.rows.length === 0){
            return res.status(401).json({message: `BUNDAY ID RAQAMDAGI TANGA MAVJUD EMAS!`})
        }
        const collectionId = await pool.query(`Select * from collections where id = $1`, [collections_id])
        if(collectionId.rows.length === 0){
            return res.status(401).json({message: `BUNDAY ID RAQAMDAGI KOLLEKSIYA MAVJUD EMAS!`})
        }
        const values = [collections_id, coin_id , condition, note]
        const query = `Insert into collection_coins (collections_id, coin_id , condition, note) VALUES ($1, $2, $3, $4) returning *`
        const newCollectionCoin = await pool.query(query, values)
        if (newCollectionCoin.rows.length === 0) {
            return res.status(401).json({ message: `Yaratishda xatolik yuz berdi` })
        }
        return res.status(201).json({
            message: `Yangi tanga kolleksiya muvaffaqiyatli yaratildi`,
            newCoin: newCollectionCoin.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const updateOne = async (req, res) => {
    try {
        const { id } = req.params
        const collectionCoinId = await pool.query(`Select * from collection_coins where id = $1 `, [id])
        if (collectionCoinId.rows.length === 0) {
            return res.status(404).json({
                message: `Bunday ID raqamdagi tanga kolleksiyasi topilmadi!`,
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
        const query = `Update collection_coins set ${fields.join(" , ")} where id = $${idx} returning *`
        const updatedCoinCollection = await pool.query(query, values)
        if (updatedCoinCollection.rows.length === 0) {
            return res.status(401).json({ message: `Yangilashda xatolik!` })
        }
        return res.status(200).json({
            message: `Tanga Kolleksiyasi ma'lumoti muvaffaqiyatli yangilandi!`,
            updatedCoinCollection: updatedCoinCollection.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const deleteOne = async (req, res) => {
    try {
        const {id} = req.params
        const CollectionCoinId = await pool.query(`Select * from collection_coins where id = $1`, [id])
        if(CollectionCoinId.rows.length === 0){
            return res.status(404).json({message: `Bunday ID raqamdagi tanga kolleksiyasi topilmadi!`,
                id: id
            })
        }
        const deleted = await pool.query(`Drop from collection_coins where id = $1 returning *`, [id])
        if(deleted.rows.length === 0){
            return res.status(401).json(`O'chirishda xatolik sodir bo'ldi!`)
        }
        return res.status(200).json({message: `Tanga Kolleksiyasi muvaffaqiyatli o'chirildi`,
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
        const query = `Select * from collection_coins where ${Keys.join("  or  ")}`
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