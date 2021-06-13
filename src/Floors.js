import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import FloorDetails from './FloorDetails'
import axios from 'axios'
import tv from './items/tv.png';
import ac from './items/ac.png';
import nescafe from './items/nescafe.jpeg';
import light from './items/light.png';
import Papa from "papaparse";

var request = require('request');

export default class Customers extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedFloor: 1,
      selectedRoom: 1,
      expanded: false
    }
  }

  //function which is called the first time the component loads
  componentDidMount() {
    this.getFloorList();
    this.getPowerAndCurrentDetails();
  }

  //Function to get the Customer Data from json
  getFloorList() {
    axios.get('assets/samplejson/floorList.json').then(response => {
      this.setState({ floorList: response.data })
    })
  };

  //Function to get the Customer Data from json
  async getFloor(floorId) {
    await axios.get(`assets/samplejson/floor${floorId}.json`).then(response => {
      console.log(response.data);
      return response.data;

    })
  };



  //Function to Load the customerdetails data from json.
  getPowerAndCurrentDetails() {
    //const dir = `/home/isharam/Videos/madhavi/BMS/public/assets/samplejson/floor${id}`; 
    //let numRooms;

    axios.get('assets/samplejson/powerAndCurrents.json').then(response => {
      console.log(response);
      this.setState({ powerAndCurrents: response.data })
    })
  };

  async handleDeviceDetailChange() {
    const acPower = document.getElementById("acPower").value;
    const acAmp = document.getElementById("acAmp").value;
    const tvPower = document.getElementById("tvPower").value;
    const tvAmp = document.getElementById("tvAmp").value;
    const nescafePower = document.getElementById("nescafePower").value;
    const nescafeAmp = document.getElementById("nescafeAmp").value;
    const lightPower = document.getElementById("lightPower").value;
    const lightAmp = document.getElementById("lightAmp").value;

    const dataToSave = {
      ac: {
        power: acPower,
        current: acAmp
      },
      tv: {
        power: tvPower,
        current: tvAmp
      },
      nescafe: {
        power: nescafePower,
        current: nescafeAmp
      },
      light: {
        power: lightPower,
        current: lightAmp
      }
    }



    const newData = JSON.stringify(dataToSave);
    console.log(newData);
    //const url = `assets/samplejson/floor1.json`;

    var clientServerOptions = {
      uri: 'http://127.0.0.1:5000/powerAndCurrents',
      body: newData,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    await request(clientServerOptions, function (error, response) {
      console.log(error, response.body);
      //return;
    });


  }

  addAC(nextDeviceId) {
    return {
      "id": nextDeviceId,
      "name": "ac",
      "state": false,
      "power": 0,
      "current": 0,
      "temperature": 25
    };
  }

  addTV(nextDeviceId) {
    return {
      "id": nextDeviceId,
      "name": "tv",
      "state": false,
      "power": 0,
      "current": 0
    };
  }

  addLight(nextDeviceId) {
    return {
      "id": nextDeviceId,
      "name": "light",
      "state": false,
      "power": 0,
      "current": 0
    };
  }


  addNescafe(nextDeviceId) {
    return {
      "id": nextDeviceId,
      "name": "nescafe",
      "state": false,
      "power": 0,
      "current": 0
    };
  }

  getAddedDevices(isACSelected, isTVSelected, isLightSelected, isNescafeSelected, existingItemCount, existingRoom ){
    if (isACSelected) {
      existingItemCount = existingItemCount + 1;
      const acDevice = this.addAC(existingItemCount);
      existingRoom.items.push(acDevice);
    }
    if (isTVSelected) {
      existingItemCount = existingItemCount + 1;
      const tvDevice = this.addTV(existingItemCount);
      existingRoom.items.push(tvDevice);

    }
    if (isLightSelected) {
      existingItemCount = existingItemCount + 1;
      const lightDevice = this.addLight(existingItemCount);
      existingRoom.items.push(lightDevice);

    }
    if (isNescafeSelected) {
      existingItemCount = existingItemCount + 1;
      const nescafeDevice = this.addNescafe(existingItemCount);
      existingRoom.items.push(nescafeDevice);

    }
    return existingRoom;
    

  }


  async handleNewDevices() {
    const floorId = parseInt(document.getElementById("floorNumber").value);
    const roomId = parseInt(document.getElementById("roomNumber").value);

    const isACSelected = document.getElementById("acCheckBox").checked;
    const isTVSelected = document.getElementById("tvCheckBox").checked;
    const isLightSelected = document.getElementById("lightCheckBox").checked;
    const isNescafeSelected = document.getElementById("nescafeCheckBox").checked;



    const existingFloor = this.state.floorList.filter(floorDetail => {
      return floorDetail.id === floorId
    });

    //var newRoomDetails;
    var existingRoomDetails;

    var existingRoom;
    var existingItemCount;
    var newRoomDetails;
    var sendData;
    var requestToSend;
    var newData;

    if (existingFloor.length == 0) {        
      //set floor
      const newFloor = {
        "id": floorId,
        "name": `Floor ${floorId}`
      }
      var newFloorList =this.state.floorList;
      newFloorList.push(newFloor);
      this.setState({ floorList: newFloorList });

      // await this.setState({ floorList: newFloorList })
      requestToSend = { data: newFloorList, fileId: 'List' }

      newData = JSON.stringify(requestToSend);
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

      

        const floorDataSend = { fileId: floorId }

        const newFloorData = JSON.stringify(floorDataSend);
        console.log(newFloorData);

        var clientServerOptions = {
          uri: 'http://127.0.0.1:5000/open',
          body: newFloorData,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
        await request(clientServerOptions, function (error, response) {
          console.log(error, response.body);

          
        });

        //new room existing floor
        existingRoom = {"items":[], "id": 1, "temperature": 30, "power": 0, "current": 0, "occupancy": 0};
        newRoomDetails = this.getAddedDevices(isACSelected, isTVSelected, isLightSelected, isNescafeSelected, 0, existingRoom )
        existingRoomDetails=[];
        existingRoomDetails.push(newRoomDetails);
        sendData = existingRoomDetails;
        console.log(sendData)



        console.log(newRoomDetails);
        //send req
        requestToSend = { data: sendData, fileId: floorId }
  
        newData = JSON.stringify(requestToSend);
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

         
         



    } else{
      axios.get(`assets/samplejson/floor${floorId}.json`).then(response => {
        console.log(response.data);
        existingRoomDetails = response.data;
        const existingRooms = existingRoomDetails.filter(roomDetail => {
          return roomDetail.id === roomId
        });
  
        
  
        if (existingRooms.length > 0) {
          existingRoom = existingRooms[0];
          existingItemCount = existingRoom.items.length;        
          
          newRoomDetails = this.getAddedDevices(isACSelected, isTVSelected, isLightSelected, isNescafeSelected, existingItemCount, existingRoom )
          sendData = existingRoomDetails.map(room => room.id === roomId ? newRoomDetails : room);
        } else {
          //new room existing floor
          existingRoom = {"items":[], "id": existingRoomDetails.length+1, "temperature": 30, "power": 0, "current": 0, "occupancy": 0};
          newRoomDetails = this.getAddedDevices(isACSelected, isTVSelected, isLightSelected, isNescafeSelected, 0, existingRoom )
          existingRoomDetails.push(newRoomDetails);
          sendData = existingRoomDetails;
  
  
        }
  
        console.log(newRoomDetails);
        //send req
        requestToSend = { data: sendData, fileId: floorId }
  
        newData = JSON.stringify(requestToSend);
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
  
  
  
      })
  
    }
    
    

    


  }


  handleEnergyPredictions() {
    const predictions = [];
    const startTime = new Date(document.getElementById("date-start").value).getTime();
    const endTime = new Date(document.getElementById("date-end").value).getTime();
    const fifteenMinutes = 1000 * 60 * 15

    for (var loopTime = startTime; loopTime < endTime; loopTime += fifteenMinutes) {
      const newPred = [];
      newPred.push(new Date(loopTime));
      newPred.push(Math.floor((Math.random() * 300) + 150));
      newPred.push(Math.floor((Math.random() * 100) + 50));
      newPred.push(Math.floor((Math.random() * 35) + 16));
      newPred.push(Math.floor((Math.random() * 12) + 1));
      predictions.push(newPred);

    }

    //csv download
    let filename = 'energy-predictions.csv';
    let columns = ['Timestamp', 'Power Predictions (kW)', 'Current Predictions (A)', 'Temperature Predictions (Celcius)', 'Occupancy Predicitons'];

    let csv = Papa.unparse({ data: predictions, fields: columns })
    if (csv == null) return;

    var blob = new Blob([csv]);
    if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
      window.navigator.msSaveBlob(blob, filename);
    else {
      var a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
      a.download = filename;
      document.body.appendChild(a);
      a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
      document.body.removeChild(a);
    }

  }


  async removeFloor(floorId) {  
    

    

    var newData = JSON.stringify({ fileId: floorId });
    console.log(newData);
    //const url = `assets/samplejson/floor1.json`;

    //send req to delete

    var clientServerOptions = {
      uri: 'http://127.0.0.1:5000/delete',
      body: newData,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
    }
    await request(clientServerOptions, function (error, response) {
        console.log(error,response.body);
        //return;
    });

    const newFloorList=this.state.floorList.filter(floorDetail => floorDetail.id !== parseInt(floorId));

    //send req to floorList
    var requestToSend = { data: newFloorList, fileId: 'List' }
  
    newData = JSON.stringify(requestToSend);
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


    await this.setState({ floorList: newFloorList });

  }





  render() {
    if (!this.state.floorList || !this.state.powerAndCurrents)
      return (<p>Loading data</p>)
    return (<div className="addmargin">
      <div className="col-md-4">

        {<Panel variant="default" style={{ color: "black", background: "mistyrose", opacity: "0.8" }} className="centeralign">
          <Panel.Heading>
            <Panel.Title componentClass="h3"> <b>Set Device Power/Current</b></Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            {console.log(this.state.powerAndCurrents)}
            <h4> <img src={ac} /> Power <input type="tegxt" id="acPower" size="5" defaultValue={this.state.powerAndCurrents.ac.power} /> kW    Current<input type="text" id="acAmp" size="5" defaultValue={this.state.powerAndCurrents.ac.current} /> A</h4>
            <h4> <img src={tv} /> Power <input type="text" id="tvPower" size="5" defaultValue={this.state.powerAndCurrents['tv'].power} /> kW    Current<input type="text" id="tvAmp" size="5" defaultValue="10" value={this.state.powerAndCurrents['tv'].current} /> A</h4>
            <h4> <img src={nescafe} /> Power <input type="text" id="nescafePower" size="5" defaultValue={this.state.powerAndCurrents['nescafe'].power} /> kW    Current<input type="text" id="nescafeAmp" size="5" defaultValue="15" value={this.state.powerAndCurrents['nescafe'].current} /> A</h4>
            <h4> <img src={light} /> Power <input type="text" id="lightPower" size="5" defaultValue={this.state.powerAndCurrents['light'].power} />kW    Current<input type="text" id="lightAmp" size="5" defaultValue="10" value={this.state.powerAndCurrents['light'].current} /> A</h4>

            <Button variant="default" style={{ color: "white", background: "grey" }} onClick={e => this.handleDeviceDetailChange()} >

              Save

            </Button>

          </Panel.Body>
        </Panel>
        }
      </div>

      <div className="col-md-4">

        <Panel variant="default" style={{ color: "black", background: "lightsteelblue", opacity: "0.95" }} className="centeralign">
          <Panel.Heading>
            <Panel.Title componentClass="h3"><b>View</b></Panel.Title>
          </Panel.Heading>
          <Panel.Body>

            <Panel variant="default" style={{ color: "black", background: "mintcream", opacity: "0.8" }} className="centeralign">
              <Panel.Heading>
                <Panel.Title componentClass="h3"><b>Floors</b></Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                {

                  this.state.floorList.map(floor => <Panel variant="default" style={{ color: "black", background: "white" }} key={floor.name} >
                    <Panel.Heading>
                      <Panel.Title componentClass="h3">{floor.name}</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>

                      <Button variant="default" style={{ color: "white", background: "purple" }} onClick={() => this.setState({ selectedFloor: floor.id })}>

                        <b>Click to View Floor</b>

                      </Button>

                      <Button variant="default" style={{ color: "white", background: "red" }} onClick={e => this.removeFloor(floor.id)}>
                        <b>Remove Floor</b>
                      </Button>


                    </Panel.Body>
                  </Panel>)
                }
              </Panel.Body>
            </Panel>


            <div className="col-md-14">
              <FloorDetails val={this.state.selectedFloor} powerAndCurrents={this.state.powerAndCurrents} />
            </div>

          </Panel.Body>
        </Panel>

      </div>



      <div className="col-md-4" style={{ background: "lightCyan", opacity: "0.8" }}>


        <Panel variant="default" style={{ color: "black", background: "lightsteelblue", opacity: "0.8" }}>
          <Panel.Heading>
            <Panel.Title componentClass="h3"><b>Energy Predictions</b></Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <br /> <br /> <br />
            Start Timestamp <input type="datetime-local" id="date-start" name="date-start" />
            <br /> <br />
            End Timestamp <input type="datetime-local" id="date-end" name="date-end" />
            <br /> <br />
            Floor Id  <input type="text" name="floor" size="5" />
            <br /> <br />
            Room Id<  input type="text" name="room" size="5" />
            <br /> <br />

            <br />


            <Button variant="default" style={{ color: "white", background: "steelBlue" }} onClick={e => this.handleEnergyPredictions()}>

              <b>Get Energy Predictions</b>

            </Button>

          </Panel.Body>
        </Panel>

        <br /><br /><br />


        <Panel variant="default" style={{ color: "black", background: "lightsteelblue", opacity: "0.8" }} >
          <Panel.Heading>
            <Panel.Title componentClass="h3"><b>Add Devices</b></Panel.Title>
          </Panel.Heading>
          <Panel.Body>


            <b>Floor Id</b>  <input type="text" id="floorNumber" size="5" /><br /><br />

            <b>Room Id</b>  <input type="text" id="roomNumber" size="5" /><br /><br />

            <input type="checkbox" id="acCheckBox" name="ac" value="AC" /> Air Conditioner
            <br />

            <input type="checkbox" id="tvCheckBox" name="tv" value="Television" /> Television
            <br />


            <input type="checkbox" id="lightCheckBox" name="light" value="Light" /> Light
            <br />


            <input type="checkbox" id="nescafeCheckBox" name="nescafe" value="Nescafe" /> Nescafe Machine
            <br />



            <div class="select-custom-content">
              <button class="btn-save btn btn-primary btn-sm" onClick={e => this.handleNewDevices()}><b>Save Devices</b></button>
            </div>


            <br /> <br /> <br />

            <br /> <br /> <br />

            <br /> <br /> <br />
          </Panel.Body>
        </Panel>

      </div>












    </div>
    )
  }

}
