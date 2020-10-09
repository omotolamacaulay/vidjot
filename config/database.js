if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb+srv://omotolamac:ragnar33@cluster0.o1l9f.mongodb.net/<dbname>?retryWrites=true&w=majority'
  }
} else {
  module.exports ={
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}