class FeatureApi{
  constructor(clientQuery,databaseQuery){
    this.clientQuery=clientQuery;
    this.databaseQuery=databaseQuery
  }
  filter(){
    const queryObj = { ...this.clientQuery };
    const deleteQuiries = ['field', 'sort', 'limit', 'page'];
    deleteQuiries.forEach((val) => {
      delete queryObj[val];
    });

    let queryClient = JSON.stringify(queryObj);

    queryClient = queryClient.replace(/\bgt|gte|lt|lte\b/g, (val) => `$${val}`);

    let queryDatabase = JSON.parse(queryClient);
    this.databaseQuery = this.databaseQuery.find(queryDatabase);
    return this
  }
  sort(){
    if (this.clientQuery.sort) {
      let sortData = this.clientQuery.sort.split(',').join(' ');
      this.databaseQuery= this.databaseQuery.sort(sortData);
    } else {
      this.databaseQuery = this.databaseQuery.sort('createAt');
    }
    return this
  }
  field(){
    if (this.clientQuery.field) {
      let fieldData = this.clientQuery.field.split(',').join(' ');
      this.databaseQuery = this.databaseQuery.select(fieldData);
    } else {
      this.databaseQuery = this.databaseQuery.select('-__v');
    }
    return this
  }
  page(){
    const page = this.clientQuery.page * 1 ;
   const limit = +this.clientQuery.limit * 1;
   this.databaseQuery = this.databaseQuery.skip((page - 1) * limit).limit(limit);

  // Tour.find({name:jalol}) name faqat jalol bo'lgan obektlarni olib keladi
   return this
  }
}

module.exports=FeatureApi