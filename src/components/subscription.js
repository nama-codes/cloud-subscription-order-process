import { Component } from 'react';

export default class Subscription extends Component {

  handleInputChange = (e) => {
    this.props.handleInputChange(e, 'subscriptionData')
  }

	render() {
		return (
      <div className="panel panel-warning">
        <div className="panel-heading">
          <h3>Subscription Details</h3>
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label>Duration (Months)<span className="required">*</span></label>
            <select className="form-control" name="duration" value={this.props.subscription.duration} onChange={(e) => this.handleInputChange(e)} disabled={this.props.isDisabled}>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
            </select>
          </div>
          <div className="form-group">
            <label>Storage Size (GB)<span className="required">*</span></label>
            <select className="form-control" name="size" value={this.props.subscription.size} onChange={(e) => this.handleInputChange(e)} disabled={this.props.isDisabled}>
              <option value={5}>5 GB</option>
              <option value={10}>10 GB</option>
              <option value={50}>50 GB</option>
            </select>
          </div>
          <div className="form-group">
            <label>Upfront Payment<span className="required">*</span></label>
            <select className="form-control" name="paymentUpfront" value={this.props.subscription.paymentUpfront} onChange={(e) => this.handleInputChange(e)} disabled={this.props.isDisabled}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
        </div>
        </div>
        <br></br>
      </div>
		);
	}
}
