class User { 
    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._id = null;  
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo; 
        this._admin = admin;
        this._register = new Date(); 
    }

   
    get id() {
        return this._id;
    }

    get register() {
        return this._register;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get birth() {
        return this._birth;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    set photo(value) {
        this._photo = value;
    }

    
    loadFromJSON(json) {
        for (let name in json) {
            if (name === '_register') {
                this[name] = new Date(json[name]); 
            } else {
                this[name] = json[name];
            }
        }
    }


    static getUsersStorage() {
        let users = [];
        if (localStorage.getItem("users")) {
            users = JSON.parse(localStorage.getItem("users"));
        }
        return users;
    }

   
    static getNewID() {
        let usersID = parseInt(localStorage.getItem("usersID")) || 0;
        usersID++;
        localStorage.setItem("usersID", usersID);
        return usersID;
    }

    save() {
        let users = User.getUsersStorage();  
    
        if (this._id > 0) {
            users = users.map(u => {
                if (u._id === this._id) {
                    return Object.assign({}, u, this); 
                }
                return u;
            });
        } else {
            this._id = this.getNewID();
            users.push(this);
        }
    
        localStorage.setItem("users", JSON.stringify(users));
    }
    removeUser() {
        let users = User.getUsersStorage();
        users = users.filter(user => user._id !== this._id);
        localStorage.setItem("users", JSON.stringify(users));
    }
}    