import firebase from 'firebase'

var config = {
  databaseURL: 'https://smart-thermostat-2c65a.firebaseio.com'
}

export default firebase.initializeApp(config).database()
