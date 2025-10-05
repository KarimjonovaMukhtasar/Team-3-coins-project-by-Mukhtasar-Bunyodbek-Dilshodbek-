// Bunyodbek
import pool from "../config/db.js"
const findAll = async (req, res)=>{
    try{
        const result = await pool.query(`Select * from comments`)
        res.send(result.rows)
    }
    catch(error){
        console.log(error)
        res.json({message: "Database error"})
    }
}

const findOne = async (req,res)=>{
    try{
        const {id} = req.params;
        const result = await pool.query(`Select * from comments where id=$1`,[id])

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "comment not found" });
        }
        res.send(result.rows[0])
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Database error"})
    }
}

const createOne = async (req,res)=>{
    try{
         const {collections_id, user_id, text} = req.body;
         if(!collections_id || !user_id || !text){
            return res.status(404).json({message: 'Malumotlar toliq emas'})
        }            
        const result = await pool.query(`INSERT INTO comments(collections_id, user_id, text)
            VALUES($1, $2, $3) RETURNING *`,
        [collections_id, user_id, text]
        );
        res.send(result.rows)
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Database error"})

    }
}

const updateOne = async (req, res)=>{
    try{
        const { id } = req.params;
        const fields =[]
        const values = []
        let idx = 1;
        // Bu yerda id ni check qilganman
    const commentCheck = await pool.query("SELECT * FROM comments WHERE id = $1", [id]);
    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: "comment not found" });
    }

    for(const [key, value] of Object.entries(req.body)){
        fields.push(`${key}=$${idx}`)
        values.push(value)
        idx++;
    }
    if (fields.length === 0) {
            return res.status(400).json({ message: "Hech qanday o'zgarish yuborilmadi" });
    }
        values.push(req.params.id)
    const result = await pool.query(`UPDATE comments SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`, values);
    return res.json({ message: "Successfully updated", comment: result.rows[0] });
    
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Database error"})
    }
}

const deleteOne = async (req, res)=>{
    try{
        const {id} = req.params

        const result = await pool.query(`Delete from comments where id=$1 RETURNING *`,[id])
        if (result.rows.length === 0) {
          return res.status(404).json({ message: "comment not found" });
        }
        return res.json({ message: "comment o'chirildi", deleted: result.rows[0] });
    }catch(error){ 
        console.log(error);
        res.status(500).json({message: "Database error"})
    }
}

const search = async (req,res)=>{
    try{
    const queryKeys = Object.keys(req.query);
    const queryValues = Object.values(req.query);

    if (queryKeys.length === 0) {
      return res.status(400).json({ message: "Hech qanday qidiruv parametri yuborilmadi" });
    }

    const conditions = queryKeys.map((key, i) => `${key} ILIKE $${i + 1}`);
    const sql = `SELECT * FROM comments WHERE ${conditions.join(" AND ")}`;
    const values = queryValues.map(v => `%${v}%`);

    const result = await pool.query(sql, values);

    res.json(result.rows);
    
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Database error"})
    }
}
export {findAll, findOne, createOne, updateOne, deleteOne, search}