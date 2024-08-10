export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString
    }

    pagination() {
        let page = this.queryString.page * 1 || 1;
        if (page < 1) page = 1;
        let limit = 2;
        let skip = 2 * page - limit
        this.mongooseQuery.find().limit(limit).skip(skip)
        this.page = page
        return this;
    }

    filter() {
        const excludeQuery = ["page", "search", "sort", "select"]
        let filterQuery = { ...this.queryString };
        excludeQuery.forEach(e => delete filterQuery[e]);
        filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|lt|gte|lte|eq)/, (match) => `$${match}`))

        this.mongooseQuery.find(filterQuery)
        return this
    }

    sort() {
        if (this.queryString.sort) {
            this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "))
        }
        return this
    }

    select() {
        // console.log(this.queryString.select);

        if (this.queryString.select) {
            this.mongooseQuery.select(this.queryString.select.replaceAll(",", " "))
        }
        return this
    }

    search() {
        if (this.queryString.search) {
            this.mongooseQuery.find({
                $or: [
                    { title: { $regex: this.queryString.search, $options: "i" } },
                    { description: { $regex: this.queryString.search, $options: "i" } }
                ]
            })
        }
        return this;
    }

}