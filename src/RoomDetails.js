import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel'
import tv from './items/tv.png';
import ac from './items/ac.png';
import nescafe from './items/nescafe.jpeg';
import light from './items/light.png';
import Button from 'react-bootstrap/lib/Button'
var request = require('request');



//This Component is a child Component of Customers Component
export default class RoomDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itemDictionary: {
        'ac': { name: 'Air Conditionar', image: ac },
        'tv': { name: 'Television', image: tv },
        'light': { name: 'Light', image: light },
        'nescafe': { name: 'Nescafe Machine', image: nescafe }
      },
      states: {

      }
    }


  }

  setItemStates(items) {

    items.map(
      item => {
        let itemName = item.name;
        this.setState({ itemName: item.state });
      }

    );

  }

  //Function which is called when the component loads for the first time
  componentDidMount() {
    console.log(this.props.val)
    this.setState({ room: this.props.val })
    this.setItemStates(this.props.val.items)
  }

  //Function which is called whenver the component is updated
  componentDidUpdate(prevProps) {

    //get Customer Details only if props has changed
    if (this.props.val !== prevProps.val) {
      this.setState({ room: this.props.val })
      this.setItemStates(this.props.val.items)

    }
  }

  calcNewPower(stateOn, itemName){
    const item = itemName.toString();

    console.log(item);
    console.log(this.props.powerAndCurrents[item].power);

    const powerVal = this.props.powerAndCurrents[item].power;
    return stateOn ? powerVal : 0;
  }

  calcNewCurrent(stateOn, itemName){
    const item = itemName.toString();
    console.log(itemName);
    const currentVal = this.props.powerAndCurrents[item].current;

    return stateOn ? currentVal : 0;
  }

  calcNewTemp(stateOn, itemName, itemId){
    console.log(stateOn);
    if (itemName !== 'ac'){
      console.log('not an ac');

      return undefined;
    }
    const currTemp = parseInt(document.getElementById(itemId.toString()).value);

    const item = itemName.toString();
    //const currentVal = oldTemp;
    const finalTemp =stateOn ? currTemp : currTemp+parseInt(currTemp)*0.05;
    document.getElementById(itemId.toString()).value = finalTemp;


    return finalTemp;
  }

  calcTotalPower(items){
    let totalPower=0;
    for(let i=0; i<items.length; i++){
      totalPower = totalPower + parseInt(items[i].power);
    }
    console.log("tot power",totalPower)
    return totalPower;
  }

  calcTotalCurrent(items){
    let totalCurrent=0;
    for(let i=0; i<items.length; i++){
      totalCurrent = totalCurrent + parseInt(items[i].current);
    }
    console.log("tot curr",totalCurrent)

    return totalCurrent;
    
  }

  calcTotalTemperature(items){
    let totalTemp=30;
    for(let i=0; i<items.length; i++){
      totalTemp = items[i].state && items[i].temperature ? totalTemp - parseInt(items[i].temperature)*0.05 : totalTemp + 0.2;
    }
    console.log("tot temp",totalTemp)

    return totalTemp;
    
  }

  async handleCheckboxChange(e, itemId) {
    console.log(itemId);
    const oldStates = this.state.room.items;
    const newStates = oldStates.map(item => item.id === itemId ? { ...item, state: e.target.checked, power: this.calcNewPower(e.target.checked, item.name), current: this.calcNewCurrent(e.target.checked, item.name),  temperature: this.calcNewTemp(e.target.checked, item.name, item.id) } : item);
    console.log(newStates);
    const newObj = { ...this.state.room, items: newStates, power: this.calcTotalPower(newStates), current: this.calcTotalCurrent(newStates), temperature: this.calcTotalTemperature(newStates) }
    await this.setState({ room: newObj });
    console.log(this.state.room);

  }

  async handleSave(itemName, itemId) {  
    let thisRoom = this.state.room;
    if (itemName === 'ac') {
      const temp = parseInt(document.getElementById(itemId.toString()).value);

      const newItems = this.state.room.items.map(item=>item.name == 'ac' ? {...item, temperature:temp } : item );
      thisRoom = { ...this.state.room, temperature: temp, items: newItems }
    }
   

    //set all rooms states
    const oldAllRomms = this.props.allRooms;
    const newAllRooms = oldAllRomms.map(room => room.id === thisRoom.id ? thisRoom : room)
    await this.setState({ allRooms: newAllRooms })

    const requestToSend={data: newAllRooms, fileId: this.props.floorId}


    const newData = JSON.stringify(requestToSend);
    console.log(newData);
    //const url = `assets/samplejson/floor1.json`;

    var clientServerOptions = {
      uri: 'http://127.0.0.1:5000/write',
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
  }

  


  render() {
    if (!this.state.room)
      return (<p>No Room Selected</p>)
    return (<div className="customerdetails">
      {console.log('changed')}
      <Panel bsStyle="info" className="centeralign" >
        <Panel.Heading>
          <Panel.Title componentClass="h3"><b>{`Room ${this.state.room.id}`}</b></Panel.Title>


        </Panel.Heading>
        <Panel.Body >
          {this.state.room.items.map(item => (
            <Panel bsStyle="info" className="centeralign" >

              <Panel.Body variant="default" style={{ color: "black", background: "lavender" }} >
                <h4>{this.state.itemDictionary[item.name].name}</h4>

                <Button variant="default" style={{ color: "white", background: "green" }} onClick={e => this.handleSave(item.name, item.id)}>
                  <b>Save Changes</b>
                </Button>
               
                <input type="checkbox" class="checkbox" checked={item.state} onChange={e => this.handleCheckboxChange(e, item.id)} />

                <label for="switch" class="toggle">
                  <p>ON      OFF</p>
                </label>



                <img src={this.state.itemDictionary[item.name].image} />
                
                <p>Power: {item.power} kW</p>
                <p>Current: {item.current} A</p>

                {item.temperature ? <p>Temperature: <input type="text" id={item.id.toString()} disabled={!item.state}  size="5" defaultValue={item.temperature} /> Celcius</p> : null}




              </Panel.Body>
            </Panel>




          )

          )}

        </Panel.Body>
      </Panel>
    </div>)
  }
}
