import express,{Application} from 'express'
import { refreshToken } from '../auth/controller'

const tokenRoute:Application=express()


tokenRoute.post('/refresh',refreshToken)

export default tokenRoute