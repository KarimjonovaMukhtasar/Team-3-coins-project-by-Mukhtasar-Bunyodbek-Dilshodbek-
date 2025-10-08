import pool from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from collection_tags`
        const allCollectiontags = await pool.query(query)
        return res.status(200).json({
            message: `Kolleksiyadagi barcha taglar:`,
            Collectiontags: allCollectiontags.rows
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
        const collectiontag = await pool.query(`Select * from collection_tags where id = $1`, [id])
        if (collectiontag.rows.length === 0) {
            return res.status(404).json({
                message: `Bu ID raqamdagi kolleksiya mavjud emas!`,
                id: id
            })
        }
        res.status(200).json({
            message: `Qidirilayotgan kolleksiya topildi, Mana:`,
            collectiontag: collectiontag.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const createOne = async (req, res) => {
    try {
        // collections_id int REFERENCES collections(id) on delete cascade,
        // tag_id int REFERENCES tags(id) on delete cascade,
        const { collection_id, tag_id} = req.body
        if (!collection_id || !tag_id ) {
            return res.status(401).json({ message: `tag kolleksiyasining barcha ma'lumotlarini to'ldirishingiz kerak!` })
        }
        const checktagId = await pool.query(`Select * from tags where id = $1`, [tag_id])
        if(checktagId.rows.length === 0){
            return res.status(401).json({message: `BUNDAY ID RAQAMDAGI tag MAVJUD EMAS!`})
        }
        const collectionId = await pool.query(`Select * from collections where id = $1`, [collection_id])
        if(collectionId.rows.length === 0){
            return res.status(401).json({message: `BUNDAY ID RAQAMDAGI KOLLEKSIYA MAVJUD EMAS!`})
        }
        const values = [collection_id, tag_id]
        const query = `Insert into collection_tags (collection_id, tag_id) VALUES ($1, $2) returning *`
        const newCollectiontag = await pool.query(query, values)
        if (newCollectiontag.rows.length === 0) {
            return res.status(401).json({ message: `Yaratishda xatolik yuz berdi` })
        }
        return res.status(201).json({
            message: `Yangi tag kolleksiya muvaffaqiyatli yaratildi`,
            newtag: newCollectiontag.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const updateOne = async (req, res) => {
    try {
        const { id } = req.params
        const collectiontagId = await pool.query(`Select * from collection_tags where id = $1 `, [id])
        if (collectiontagId.rows.length === 0) {
            return res.status(404).json({
                message: `Bunday ID raqamdagi tag kolleksiyasi topilmadi!`,
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
        const query = `Update collection_tags set ${fields.join(" , ")} where id = $${idx} returning *`
        const updatedtagCollection = await pool.query(query, values)
        if (updatedtagCollection.rows.length === 0) {
            return res.status(401).json({ message: `Yangilashda xatolik!` })
        }
        return res.status(200).json({
            message: `Tag Kolleksiyasi ma'lumoti muvaffaqiyatli yangilandi!`,
            updatedtagCollection: updatedtagCollection.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Server bilan bog'liq xatolik!` })
    }
}
const deleteOne = async (req, res) => {
    try {
        const {id} = req.params
        const CollectiontagId = await pool.query(`Select * from collection_tags where id = $1`, [id])
        if(CollectiontagId.rows.length === 0){
            return res.status(404).json({message: `Bunday ID raqamdagi tag kolleksiyasi topilmadi!`,
                id: id
            })
        }
        const deleted = await pool.query(`Drop from collection_tags where id = $1 returning *`, [id])
        if(deleted.rows.length === 0){
            return res.status(401).json(`O'chirishda xatolik sodir bo'ldi!`)
        }
        return res.status(200).json({message: `Tag Kolleksiyasi muvaffaqiyatli o'chirildi`,
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
        const query = `Select * from collection_tags where ${Keys.join("  or  ")}`
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