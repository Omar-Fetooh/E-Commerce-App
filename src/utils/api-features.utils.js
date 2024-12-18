export class ApiFeatures {
  constructor(mongooseQuery, query) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
  }

  sort() {
    this.mongooseQuery.sort(this.query.sort);
    return this;
  }

  pagination() {
    const { page = 1, limit = 1 } = this.query;

    const skip = (page - 1) * limit;
    this.mongooseQuery.limit(limit).skip(skip);

    return this;
  }

  filters() {
    const { page = 1, limit = 1, sort, ...filters } = this.query;

    const filtersAsString = JSON.stringify(filters);
    const replacedFilters = filtersAsString.replaceAll(
      /lt|gt|lte|gte|ne|eq|regex/g,
      (ele) => {
        return `$${ele}`;
      }
    );

    const parsedFilters = JSON.parse(replacedFilters);

    this.mongooseQuery.find(parsedFilters);

    return this;
  }
}
