import db from "../db.js";
import jwt from "jsonwebtoken";

// GET all posts or by category
export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE category = ?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// GET single post by ID (includes post ID)
export const getPost = (req, res) => {
  const q = `
    SELECT p.id, username, title, \`desc\`, p.img, image, category, date
    FROM users u 
    JOIN posts p ON u.id = p.uid 
    WHERE p.id = ?
  `;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Post not found");
    return res.status(200).json(data[0]);
  });
};

// CREATE new post
export const createPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      INSERT INTO posts(title, \`desc\`, img, category, date, uid)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.category,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json("Post has been created.");
    });
  });
};

// DELETE post
export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id = ? AND uid = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) {
        return res.status(200).json("Post has been deleted.");
      } else {
        return res.status(403).json("You can delete only your post!");
      }
    });
  });
};

// UPDATE post
export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      UPDATE posts 
      SET title = ?, \`desc\` = ?, img = ?, category = ?
      WHERE id = ? AND uid = ?
    `;

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.category,
    ];

    db.query(q, [...values, req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been updated.");
    });
  });
};













// import db from "../db.js";
// import jwt from "jsonwebtoken";

// export const getPosts = (req, res) => {
//     const q = req.query.cat ? "select * from posts where category = ?" : "select * from posts";

//     db.query(q, [req.query.cat], (err, data) => {
//         if (err) return res.status(500).json(err);
//         return res.status(200).json(data);}
//     );
// };
 
// export const getPost = (req, res) => {
//     const q = "select `username`, `title`, `desc`, p.img, `image` , `category`, `date` from users u join posts p on u.id = p.uid where p.id = ?";
//     db.query(q, [req.params.id], (err, data) => {
//         if (err) return res.status(500).json(err);
//         if (data.length === 0) return res.status(404).json("Post not found");
//         return res.status(200).json(data[0]);
//     });
// }

// export const createPost = (req, res) => {
//     const token = req.cookies.access_token;
//     if (!token) return res.status(401).json("Not authenticated!");

//     jwt.verify(token, "jwtkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const q = "insert into posts(`title`, `desc`, `img`, `category`, `date`, `uid`) values (?)";
//         const values = [
//             req.body.title,
//             req.body.desc,
//             req.body.img,
//             req.body.category,
//             req.body.date,
//             userInfo.id
//         ];
//         db.query(q, [values], (err, data) => {
//             if (err) return res.status(500).json(err);
//             return res.status(201).json("Post has been created.");
//         });
//     });
// }

// export const deletePost = (req, res) => {
//     const token = req.cookies.access_token;
//     if (!token) return res.status(401).json("Not authenticated!");

//     jwt.verify(token, "jwtkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const postId = req.params.id;
//         const q = "delete from posts where id = ? and uid = ?";

//         db.query(q, [postId, userInfo.id], (err, data) => {
//             if (err) return res.status(500).json(err);
//             if (data.affectedRows > 0) {
//                 return res.status(200).json("Post has been deleted.");
//             } else {
//                 return res.status(403).json("You can delete only your post!");
//             }
//         });
//     });

// }

// export const updatePost = (req, res) => {

//     const token = req.cookies.access_token;
//     if (!token) return res.status(401).json("Not authenticated!");

//     jwt.verify(token, "jwtkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//          const q = "update posts set `title` = ?, `desc` = ?, `img` = ?, `category` = ? where id = ? and uid = ?";
//         const values = [
//             req.body.title,
//             req.body.desc,
//             req.body.img,
//             req.body.category
//         ];
//         db.query(q, [...values, req.params.id, userInfo.id], (err, data) => {
//             if (err) return res.status(500).json(err);
//             return res.status(200).json("Post has been updated.");
//         });
//     });

// }