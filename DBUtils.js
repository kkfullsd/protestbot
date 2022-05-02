const fs = require('fs');
const path = require('path');

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

class DBUtils {
    dbPath;
    imageFolderPath;
    dbJSON;
  
    constructor (dbPath, imageFolderPath) {
        this.dbPath = path.normalize(dbPath);
        this.imageFolderPath = path.normalize(imageFolderPath);

        let dbFile = fs.readFileSync(dbPath, {
            encoding: 'utf-8'
        });
        this.dbJSON = JSON.parse(dbFile);
    }

    getRandomTask = () => {
        let task = {...this.dbJSON.random()};
        if (task) {
            task.image = path.join(this.imageFolderPath, task.image);
            return task;
        }
        return this.getExceptionMessage();
    }


    getRandomTaskByLvl = (lvl) => {
        let task = {...this.dbJSON.filter((task) => task.lvl === lvl).random()};
        if (task) {
            task.image = path.normalize(path.join(this.imageFolderPath, task.image))
            return task;
        }
        return this.getExceptionMessage();
    }

    getExceptionMessage = () => {
        return {lvl: 0, category: 0, image: "", text: "Пока нет протестов такой сложности"};
    }

}


module.exports = DBUtils;