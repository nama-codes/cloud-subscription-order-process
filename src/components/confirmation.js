import { Component } from 'react';

export default class Confirmation extends Component {

  handleInputChange = (e) => {
    if (e.target.type === "checkbox") {
      e.target.value = e.target.checked ? 1 : 0;
    } else if (e.target.name === "email") {
      e.target.value = e.target.value.toLowerCase();
    }
    this.props.handleInputChange(e, 'confirmationData')
  }

	render() {
		return (
      <div className="panel panel-success">
        <div className="panel-heading">
          <h3>Order Confirmation</h3>
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label>Email Id<span className="required">*</span></label>
            <input type="text" className="form-control" name="email" value={this.props.confirmation.email} onChange={(e) => this.handleInputChange(e)}/>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" name="confirmationTnC" checked={+this.props.confirmation.confirmationTnC} onChange={(e) => this.handleInputChange(e)} />
              I have read all the <a href="/#">Terms and Conditions</a>.<span className="required">*</span>
            </label>
          </div>
        </div>
        <br></br>
      </div>
		);
	}
}
