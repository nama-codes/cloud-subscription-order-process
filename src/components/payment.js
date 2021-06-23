import { Component } from 'react';

export default class Payment extends Component {

  handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, '')
    if (name === "cardNumber") {
      value = value.replace(/(.{4})/g, '$1 ').trim()
    } else if (name === "expirationDate" ) {
      if (value.length > 2) {
        value = `${value.slice(0,2)}/${value.slice(2)}`;
      }
    }
    e.target.value = value;
    this.props.handleInputChange(e, 'paymentData')
  }

	render() {
		return (
      <div className="panel panel-info">
        <div className="panel-heading">
          <h3>Payment Details</h3>
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label>Card Number<span className="required">*</span></label>
            <input type="text" className="form-control" name="cardNumber" value={this.props.payment.cardNumber} onChange={(e) => this.handleInputChange(e)} maxLength={19}/>
          </div>
          <div className="form-group">
            <label>Expiration Date (MM/YYYY)<span className="required">*</span></label>
            <input type="text" className="form-control" name="expirationDate" value={this.props.payment.expirationDate} onChange={(e) => this.handleInputChange(e)} maxLength={7}/>
          </div>
          <div className="form-group">
            <label>Security Code<span className="required">*</span></label>
            <input type="password" className="form-control" name="securityCode" value={this.props.payment.securityCode} onChange={(e) => this.handleInputChange(e)} maxLength={3}/>
          </div>
        </div>
        <br></br>
      </div>
		);
	}
}
