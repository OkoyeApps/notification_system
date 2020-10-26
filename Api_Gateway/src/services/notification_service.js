const { json } = require('express');
const Notification_Model = require('../models/notification_model');

class Notification {
    constructor(redisclient) {
        this._publisher = redisclient.duplicate();
        this.subsciber= redisclient.duplicate();

        this.subsciber.subscribe("add_notification");
        this.subsciber.on("message", (channel, message) => {
            switch (channel) {
                case "add_notification":
                    let jsonData = JSON.parse(message);
                    this.saveNotification(jsonData.user_id, jsonData.message);
                    break;
            
                default:
                    break;
            }
        });
    }

    saveNotification(user_id, message) {
        console.log("called check")
        if (user_id && message) {
            const newNotification = {
                message: message,
                user_id: user_id
            };
            return Notification_Model.create(newNotification).then(result => {
                //Publish a message for notification service here
                this._publisher.publish("notification_added", JSON.stringify(result.toObject()));
                return { success: true, data: result.toObject(), status: 201 };
            }).catch(error => {
                //log error here later
                return { success: false, error: error, status: 500 };
            });
        } else {
            return Promise.reject({ success: false, error: new Error("incomplete message"), status: 500 });
        }
    }
    getNotifications(paginationParams, sortParams, filterParams, urlDetail) {
        return Promise.all([this._findDocument(paginationParams), this._getEstimatedDocsInDB()])
            .then(result => {
                let [foundData, dataCount] = result;
                let metaData = this._getMetaDataForResult(paginationParams, dataCount, urlDetail);
                return { success: true, data: foundData, status: 200, included: metaData };;
            }).catch(error => {
                return { success: false, error: error, status: 500 };
            });
    }
    _findDocument(paginationParams) {
        let { pagenumber, pagesize } = this._pagingQueryGenerator(paginationParams);
        return Notification_Model.find({}).skip((pagenumber - 1) * pagesize)
            .limit(pagesize).select({ createdAt: 0, updatedAt: 0 })
            .then(result => {
                return result;
            }).catch(error => {
                return error;
            });
    };

    _getEstimatedDocsInDB() {
        return Notification_Model.estimatedDocumentCount().then(result => result).catch(error => error);
    }

    /**
     * @description this function generates metadata for a client navigation from a get request to notification endpoint
     * @param {object} paginationParams 
     * @param {Number} docCount 
     */
    _getMetaDataForResult(paginationParams, documentCount, urlDetail) {
        let { pagenumber, pagesize } = this._pagingQueryGenerator(paginationParams);
        let totalPages = Math.floor(documentCount / pagesize);
        let navigationLinks = this._generateNavigationLinks(urlDetail, pagenumber, pagesize, documentCount);
        return { count: pagesize, start: (pagenumber - 1) * pagesize, total: documentCount, totalPages: totalPages, links: navigationLinks };
    }
    _generateNavigationLinks(urlDetail, currentPage, pagesize, totalPages) {
        let next = currentPage * pagesize < totalPages ? currentPage + 1 : null;
        let previous = ((currentPage -1) * pagesize) < totalPages ? currentPage - 1 : null;
        let nextUrl = next ? this._convertObjectToUrl(urlDetail.baseUrl, { ...urlDetail.querystring, pagenumber: next, pagesize: pagesize }) : null;
        let previousUrl = previous ? this._convertObjectToUrl(urlDetail.baseUrl, { ...urlDetail.querystring, pagenumber: previous, pagesize: pagesize }) : null;
        let result = [];
        if (next) {
            result = [...result, { next: nextUrl }];
        }
        if (previous) {
            result = [...result, { previous: previousUrl }];
        }
        return result;
    }

    _convertObjectToUrl(baseurl = "", urlObject = {}) {
        let entries = Object.entries(urlObject);
        entries = entries.map(entry => entry.join("="));
        let urlToReturn = entries.join("&");
        return `${baseurl}?${urlToReturn}`;
    }

    _pagingQueryGenerator(paginationParams) {
        let { pagenumber, pagesize } = paginationParams;
        pagesize = !isNaN(parseInt(pagesize)) && parseInt(pagesize) > 0 ? parseInt(pagesize) : 5;
        pagenumber = !isNaN(parseInt(pagenumber)) && parseInt(pagesize) > 0 ? parseInt(pagenumber) : 1;
        
        return { pagenumber, pagesize };
    }
}

module.exports = Notification;