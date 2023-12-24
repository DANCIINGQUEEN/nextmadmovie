import mongoose from 'mongoose'

const playListSchema = new mongoose.Schema({
    date: {type: String, required: true},
    video: [{
        title:{type:String, required: true},
        link:{type:String, required:true}
    }]
})

const playList=mongoose.models.playList||mongoose.model('playList', playListSchema)
export default playList


