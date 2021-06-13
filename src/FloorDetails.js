import React, {Component} from 'react';
import Panel from 'react-bootstrap/lib/Panel'
import axios from 'axios'
import Button from 'react-bootstrap/lib/Button'
import RoomDetails from './RoomDetails';

var request = require('request');

//This Component is a child Component of Customers Component
export default class FloorDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {roomDetails:[], selectedRoom: undefined}
  }
  

  //Function which is called when the component loads for the first time
  componentDidMount() {
    this.getRoomDetails(this.props.val)
  }
  
  
  //Function which is called whenver the component is updated
  componentDidUpdate(prevProps) {   
  
    //get Customer Details only if props has changed
    if (this.props.val !== prevProps.val) {     

      this.getRoomDetails(this.props.val)
    }
  }

  //Function to Load the customerdetails data from json.
  getRoomDetails(id) {
    //const dir = `/home/isharam/Videos/madhavi/BMS/public/assets/samplejson/floor${id}`; 
    //let numRooms;

    axios.get('assets/samplejson/floor' + id + '.json').then(response => {
      this.setState({roomDetails: response.data})
      this.setState({selectedRoom: response.data[0]})

    })     
  };

  async removeRoom(roomId) {  
    const flooId = this.props.val;
    var newRoomDetails = this.state.roomDetails.filter(roomDetail => roomDetail.id !== parseInt(roomId));

    //send req to floorList
    var requestToSend = { data: newRoomDetails, fileId: flooId }
  
    var newData = JSON.stringify(requestToSend);
    console.log(newData);

    var clientServerOptions = {
      uri: 'http://127.0.0.1:5000/write',
      body: newData,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    request(clientServerOptions, function (error, response) {
      console.log(error, response.body);
    });


    await this.setState({ roomDetails: newRoomDetails });

  }

  render() {
    if (!this.state.roomDetails)
      return (<p>Loading Data</p>)
    return (<div className="customerdetails"> 
      <Panel variant="default" style={{ color: "black", background: "white", opacity: "0.8" }}  className="centeralign">
        <Panel.Heading>
          <Panel.Title componentClass="h3"><b>{`Floor ${this.props.val}`}</b></Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {
            
            this.state.roomDetails.map(room => (
            <Panel variant="default" style={{ color: "black", background: "aliceBlue" }}  className="centeralign">
              <Panel.Heading variant="default" style={{ color: "black", background: "aliceBlue" }} >
                <Panel.Title componentClass="h3">{`Room ${room.id}`}</Panel.Title>
            </Panel.Heading>
            <Panel.Body >



               <p>Power: {room.power} kW</p>
                <p>Current: {room.current} A</p>
                <p>Temperature: {room.temperature} Celcius</p>
                <p>Occupancy: {room.occupancy}</p>

              <br />
            
              <Button bsStyle="info" onClick={() => this.setState({selectedRoom: room})}>
              <b>Click to View Room</b>
              </Button>
              
              <Button variant="default" style={{ color: "white", background: "red" }} onClick={e => this.removeRoom(room.id)}>
                        <b>Remove Room</b>
                </Button>

              


            </Panel.Body>
             </Panel>
            
              
            ))
            
          }
         
        </Panel.Body>
      </Panel>

      <div className="col-md-14">
        {console.log(this.state.selectedRoom)}
        {this.state.selectedRoom !== undefined ? <RoomDetails val={this.state.selectedRoom} allRooms={this.state.roomDetails} floorId={this.props.val} powerAndCurrents={this.props.powerAndCurrents}/> : null} 
      </div>

    </div>)
  }
}
