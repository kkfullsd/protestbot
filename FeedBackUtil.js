const fs = require('fs');
const path = require('path');

class FeedBackUtil {

    feedBackPath = path.join(__dirname, 'database', 'feedbacks.json');

    addFeedBack(feedbackString, name, attachments) {
        try {
            let feedBackFile = fs.readFileSync(this.feedBackPath, 'utf-8');
            let json = JSON.parse(feedBackFile);
            json.push({
                name: name,
                date: Date.now(),
                text: feedbackString,
                attachments: attachments || {},
            });
            fs.writeFileSync(this.feedBackPath, JSON.stringify(json));
        } catch (error) {
            console.log(error)
            throw 'Не удалось записать фидбек'
        }
    }

    getFeedBack() {
        try {
            let feedBackFile = fs.readFileSync(this.feedBackPath, 'utf-8');
            let json = JSON.parse(feedBackFile);
            return json;
        } catch(e) {
            throw 'Не удалось загрузить данные о фидбеках'
        }
    }

}

module.exports = FeedBackUtil