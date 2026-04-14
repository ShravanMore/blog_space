import db from "../db.js";
import jwt from "jsonwebtoken";

// GET all posts or by category or by author
export const getPosts = (req, res) => {
  let q = `
    SELECT p.*, u.username, u.image AS userImage,
      (SELECT COUNT(*) FROM likes WHERE pid = p.id) AS likeCount
    FROM posts p
    JOIN users u ON p.uid = u.id
    ${req.query.likedBy ? 'JOIN likes l ON p.id = l.pid' : ''}
    WHERE 1=1
  `;
  const values = [];

  if (req.query.cat) {
    q += " AND p.category = ?";
    values.push(req.query.cat);
  }

  if (req.query.uid) {
    q += " AND p.uid = ?";
    values.push(req.query.uid);
  }

  if (req.query.likedBy) {
    q += " AND l.uid = ?";
    values.push(req.query.likedBy);
  }

  q += " ORDER BY p.date DESC";

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// GET single post by ID (includes post ID)
export const getPost = (req, res) => {
  const token = req.cookies.access_token;
  let userId = null;
  if (token) {
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (!err) userId = userInfo.id;
    });
  }

  const q = `
    SELECT p.id, username, title, \`desc\`, p.img, image, category, date, p.uid, p.views,
      (SELECT COUNT(*) FROM likes WHERE pid = p.id) AS likeCount
      ${userId ? `, (SELECT COUNT(*) FROM likes WHERE pid = p.id AND uid = ${db.escape(userId)}) AS isLiked` : ''}
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
      if (err) { console.error("CREATE POST ERROR:", err); return res.status(500).json(err); }
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

// INCREMENT view count
export const incrementView = (req, res) => {
  const q = "UPDATE posts SET views = views + 1 WHERE id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("View incremented.");
  });
};

// TOGGLE Like
export const toggleLike = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const qCheck = "SELECT * FROM likes WHERE uid = ? AND pid = ?";
    db.query(qCheck, [userInfo.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.length > 0) {
        // User already liked it, so unlike it
        const qDel = "DELETE FROM likes WHERE uid = ? AND pid = ?";
        db.query(qDel, [userInfo.id, req.params.id], (err, result) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json({ isLiked: false });
        });
      } else {
        // User hasn't liked it, so insert like
        const qIns = "INSERT INTO likes(uid, pid) VALUES (?, ?)";
        db.query(qIns, [userInfo.id, req.params.id], (err, result) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json({ isLiked: true });
        });
      }
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