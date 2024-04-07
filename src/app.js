const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hbs = require('express-handlebars');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();

app.use(cookieParser('webbansim'))
app.use(session({
    secret: "webbansim",
    resave: true,
    saveUninitialized: true
}))

app.engine('handlebars', hbs.engine({
    defaultLayout: 'main',
    helpers: {
        currentSelection: (item, value) => {
            return item === value ? "selected" : "";
        },
        vietnamesePrice: (price) => {
            return price.toLocaleString('vi-VN');
        },
        colorSimType: (type) => {
            if (type === "Sim tiến lên")
                return "success";
            else if (type === "Sim số đẹp")
                return "primary";
            else if (type === "Sim tứ quý")
                return "danger";
            else
                return "";
        },
        imageSimProvider: (provider) => {
            if (provider === "Mobifone")
                return "img36.png";
            else if (provider === "Viettel")
                return "img37.png";
            else if (provider === "Vinaphone")
                return "img38.png";
            else
                return "img39.png";
        },
        getBoughtState: (bought) => {
            return bought === 0 ? "Chưa bán" : "Đã bán";
        },
        getBoughtStateBackground: (bought) => {
            return bought === 0 ? "" : "bg-warning";
        }
    }
}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'))

app.get("/", (req, res) => {
    let fullname = req.session.fullname;
    let role = req.session.role;

    if (role === "admin")
        return res.redirect("/sign-in");

    db.query("select * from datapack", (error, results, fields) => {
        let datapacks = [];

        results.forEach(dp => {
            datapacks.push({
                id: dp.id,
                price: dp.price,
                cycle: dp.cycle,
                description: dp.description,
            })
        })

        db.query("select * from sim where bought = 0 and deleted = 0", (error, results, fields) => {
            let sims = [];

            results.forEach(s => {
                sims.push({
                    code: s.code,
                    price: s.price,
                    selectionFee: s.selectionFee,
                    type: s.type,
                    provider: s.provider
                })
            })

            res.render("index", { fullname, datapacks, sims });
        })
    })
})

app.get("/provider/:name", (req, res) => {
    let fullname = req.session.fullname;
    let role = req.session.role;

    if (role === "admin")
        return res.redirect("/sign-in");

    let name = req.params.name;

    db.query("select * from sim where provider = ? and bought = 0 and deleted = 0", name, (error, results, fields) => {
        let sims = [];

        results.forEach(s => {
            sims.push({
                code: s.code,
                price: s.price,
                selectionFee: s.selectionFee,
                type: s.type,
                provider: s.provider
            })
        })

        res.render("provider", { fullname, sims });
    })
})

app.get("/type/:name", (req, res) => {
    let fullname = req.session.fullname;
    let role = req.session.role;

    if (role === "admin")
        return res.redirect("/sign-in");

    let name = req.params.name;

    db.query("select * from sim where type = ? and bought = 0 and deleted = 0", name, (error, results, fields) => {
        let sims = [];

        results.forEach(s => {
            sims.push({
                code: s.code,
                price: s.price,
                selectionFee: s.selectionFee,
                type: s.type,
                provider: s.provider
            })
        })

        res.render("type", { fullname, sims });
    })
})

app.get("/cart", (req, res) => {
    let fullname = req.session.fullname;
    let role = req.session.role;
    let cartId = req.session.cartId;

    if (!role || role === "admin")
        return res.redirect("/sign-in");

    let sql = `select s.code, s.price, s.selectionFee, s.type, s.provider, sum(s.price + s.selectionFee) as total
               from sim s, simcart sc
               where s.code = sc.simCode and s.bought = 0 and s.deleted = 0 and sc.cartId = ?
               group by s.code, s.price, s.selectionFee, s.type, s.provider
               `;

    db.query(sql, cartId, (error, results, fields) => {
        let sims = [];
        let total = 0;

        results.forEach(s => {
            sims.push({
                code: s.code,
                price: s.price,
                selectionFee: s.selectionFee,
                type: s.type,
                provider: s.provider
            })

            total += s.total;
        })

        db.query("update cart set total = ? where id = ?", [total, cartId], (error, results, fields) => {
            res.render("cart", { fullname, sims, total });
        })
    })
})

app.post("/cart", (req, res) => {
    let role = req.session.role;

    if (!role || role !== "customer")
        return res.json({ message: "Bạn cần đăng nhập để thêm sim vào giỏ hàng" });

    let simCode = req.body.simCode;
    let sql = "select * from simcart where simCode = ? and cartId = ?";
    let params = [simCode, req.session.cartId];

    db.query(sql, params, (error, results, fields) => {
        if (results.length > 0)
            return res.json({ message: "Sim này đã tồn tại trong giỏ hàng" });

        db.query("insert into simcart values(?, ?)", params, (error, results, fields) => {
            res.json({ message: "Thêm sim vào giỏ hàng thành công" });
        })
    })
})

app.delete("/cart", (req, res) => {
    let simCode = req.body.simCode;
    let sql = "delete from simcart where simCode = ? and cartId = ?";
    let params = [simCode, req.session.cartId];

    db.query(sql, params, (error, results, fields) => {
        res.json({ message: "Đã xóa sim " + simCode });
    })
})

app.get("/sign-out", (req, res) => {
    delete req.session.fullname;
    delete req.session.role;
    delete req.session.cartId;

    res.redirect("sign-in");
})

app.get("/sign-in", (req, res) => {
    let role = req.session.role;

    if (role === "admin")
        res.redirect("/admin/sim");
    else if (role === "customer")
        res.redirect("/");
    else
        res.render("sign-in");
})

app.post("/sign-in", (req, res) => {
    let { phone, password } = req.body;

    db.query("select * from users where phone = ?", phone, (error, results, fields) => {
        if (results.length <= 0)
            return res.render("sign-in", { error: "Thông tin đăng nhập không hợp lệ" });

        if (!bcrypt.compareSync(password, results[0].password))
            return res.render("sign-in", { error: "Thông tin đăng nhập không hợp lệ" });

        req.session.fullname = results[0].fullname;
        req.session.role = results[0].role;
        req.session.cartId = results[0].cartId;
        req.session.phone = results[0].phone;

        if (req.session.role === "customer")
            res.redirect("/");
        else
            res.redirect("/admin/sim");
    });
})

app.get("/admin/sim", (req, res) => {
    let role = req.session.role;

    if (!role || role === "customer")
        return res.redirect("/sign-in");

    db.query("select * from sim where deleted = 0", (error, results, fields) => {
        let sims = [];

        results.forEach(s => {
            sims.push({
                code: s.code,
                price: s.price,
                selectionFee: s.selectionFee,
                type: s.type,
                provider: s.provider,
                bought: s.bought
            })
        })

        res.render("admin-sim", { layout: "admin", sims });
    })
})

app.post("/admin/sim", (req, res) => {
    let { code, price, selectionFee, type, provider } = req.body;

    if (code === "" || price === "" || selectionFee === "")
        return res.json({ status: false, message: "Hãy điền đầy đủ thông tin" });

    let regex = /^(0[1-9]{1})+([0-9]{8})$/;
    if (!regex.test(code))
        return res.json({ status: false, message: "Số điện thoại không đúng định dạng" });

    if (price < 0 || selectionFee < 0)
        return res.json({ status: false, message: "Giá tiền không được nhỏ hơn 0" });

    db.query("select * from sim where code = ?", code, (error, results, fields) => {
        if (results.length > 0)
            return res.json({ status: false, message: "Số điện thoại này đã tồn tại" });

        db.query("insert into sim() values(?, ?, ?, ?, ?, 0, 0)", [code, price, selectionFee, type, provider], (error, results, fields) => {
            res.json({ status: true, message: "Thêm mới sim thành công." });
        })
    });
})

app.put("/admin/sim", (req, res) => {
    let { code, price, selectionFee, type, provider } = req.body;

    if (price === "" || selectionFee === "")
        return res.json({ status: false, message: "Hãy điền đầy đủ thông tin" });

    if (price < 0 || selectionFee < 0)
        return res.json({ status: false, message: "Giá tiền không được nhỏ hơn 0" });

    let sql = "update sim set price = ?, selectionFee = ?, type = ?, provider = ? where code = ?";
    let params = [price, selectionFee, type, provider, code]

    db.query(sql, params, (error, results, fields) => {
        res.json({ status: true, message: "Chỉnh sửa sim thành công." });
    })
})

app.delete("/admin/sim", (req, res) => {
    let code = req.body.code;

    db.query("update sim set deleted = 1 where code = ?", code, (error, results, fields) => {
        res.json({ status: true, message: "Xóa sim thành công." });
    })
})

app.get("/admin/order", (req, res) => {
    let role = req.session.role;

    if (!role || role === "customer")
        return res.redirect("/sign-in");

    db.query("select * from orders", (error, results, fields) => {
        let orders = [];

        results.forEach(o => {
            orders.push({
                id: o.id,
                userPhone: o.userPhone,
                total: o.total,
                date: o.date,
            })
        })

        res.render("admin-order", { layout: "admin", orders });
    })
})

app.get("/sign-up", (req, res) => {
    let role = req.session.role;

    if (role === "admin")
        res.redirect("/admin/sim");
    else if (role === "customer")
        res.redirect("/");
    else
        res.render("sign-up");
})

app.post("/sign-up", (req, res) => {
    let { phone, password, repassword, fullname, address, gender } = req.body;

    if (phone === "" || password === "" || repassword === "" || fullname === "" || address === "" || gender === "")
        return res.render("sign-up", { error: "Hãy điền đầy đủ thông tin", phone, password, repassword, fullname, address, gender });

    let regex = /^(0[1-9]{1})+([0-9]{8})$/;
    if (!regex.test(phone))
        return res.render("sign-up", { error: "Số điện thoại không đúng định dạng", phone, password, repassword, fullname, address, gender });

    if (password !== repassword)
        return res.render("sign-up", { error: "Nhập lại mật khẩu không chính xác", phone, password, repassword, fullname, address, gender });

    db.query("select * from users where phone = ?", phone, (error, results, fields) => {
        if (results.length > 0)
            return res.render("sign-up", { error: "Số điện thoại này đã tồn tại", phone, password, repassword, fullname, address, gender });

        db.query("insert into cart(total) values(0)", (error, results, fields) => {
            password = bcrypt.hashSync(password, 10);
            let cartId = results.insertId;

            let sql = 'insert into users() values(?,?,?,?,?,?,?)';
            let params = [phone, password, fullname, address, gender, cartId, "customer"];

            db.query(sql, params, (error, results, fields) => {
                res.redirect("/sign-in");
            })
        })
    });
})

app.get("/sort", (req, res) => {
    let role = req.session.role;

    if (role === "admin")
        return res.redirect("/sign-in");

    let sortType = req.query.sortType;
    let sql = "";

    if (sortType === "Giá thấp đến cao")
        sql = "select * from sim where bought = 0 and deleted = 0 order by (price + selectionFee) asc";
    else if (sortType === "Giá cao đến thấp")
        sql = "select * from sim where bought = 0 and deleted = 0 order by (price + selectionFee) desc";
    else
        sql = "select * from sim where bought = 0 and deleted = 0";

    db.query(sql, (error, results, fields) => {
        let sims = [];

        results.forEach(s => {
            sims.push({
                code: s.code,
                price: s.price,
                selectionFee: s.selectionFee,
                type: s.type,
                provider: s.provider
            })
        })

        res.json({ sims: sims });
    })
})

app.post("/pay", (req, res) => {
    let cartId = req.session.cartId;
    let phone = req.session.phone;
    let total = req.body.total;

    db.query("select simCode from simcart where cartId = ?", cartId, (error, results, fields) => {
        if (results.length <= 0)
            return res.json({ message: "Giỏ hàng hiện tại đang trống" });

        // Sau khi thanh toán thì chuyển trạng thái các sim có trong giỏ hàng thành "đã mua"
        results.forEach(s => {
            db.query("update sim set bought = 1 where code = ?", s.simCode);
        })

        // Sau khi thanh toán thì xóa hết sim trong giỏ hàng
        db.query("delete from simcart where cartId = ?", cartId);

        // Sau khi thanh toán thì tạo lịch sử đơn hàng
        let currentDate = new Date();
        let day = currentDate.getDate().toString().padStart(2, '0');
        let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        let year = currentDate.getFullYear().toString();
        let hours = currentDate.getHours().toString().padStart(2, '0');
        let minutes = currentDate.getMinutes().toString().padStart(2, '0');
        let seconds = currentDate.getSeconds().toString().padStart(2, '0');

        let id = day + month + year + hours + minutes + seconds;
        let date = `${day}/${month}/${year}`

        db.query("insert into orders values(?,?,?,?)", [id, phone, total, date]);

        res.json({ message: "Thanh toán thành công" });
    })
})

app.use((req, res) => {
    res.status(404)
    res.render('404', { layout: null })
})

app.use((err, req, res, next) => {
    res.status(500);
    res.render('500', { layout: null });
});

app.listen(9000, () => {
    db.connect((error) => {
        if (error)
            throw new Error("Có lỗi xảy ra khi kết nối CSDL MySQL");

        console.log("Trang web đã được start thành công trên port 9000.");
    })
})