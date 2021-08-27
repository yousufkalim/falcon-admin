import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Row, Col } from "react-bootstrap";

// import end complimentory.
const $ = require("jquery");
$.DataTable = require("datatables.net");
export default class DataTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.$el = $(this.el);
    if (this.props.is_order !== true) {
      this.$el.DataTable({
        data: this.props.data,
        columns: this.props.columns,
        columnDefs: [
          {
            targets: this.props.actionCol,
            createdCell: (td, cellData, rowData, row, col) =>
              ReactDOM.render(
                <React.Fragment>
                  {this.props.tableType !== "tableData" && (
                    <Button
                      variant="success"
                      onClick={() => this.props.actions.updateAction(cellData)}
                      style={{ width: "150px", marginTop: 10, marginLeft: 10 }}
                    >
                      Edit
                    </Button>
                  )}

                  {/* {this.props.is_restaurant === true?
                <a href={"/menu/"+cellData} ><Button variant="primary" style={{margin:10 }}>View Menu</Button></a>
                :""} */}
                  {this.props.is_menu || this.props.is_active === true ? (
                    <>
                      <Button
                        variant="primary"
                        onClick={() =>
                          this.props.actions.deactivateAction(cellData)
                        }
                        style={{
                          width: "150px",
                          marginTop: 10,
                          marginLeft: 10,
                        }}
                      >
                        Deactivate
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        onClick={() =>
                          this.props.actions.deactivateAction(cellData)
                        }
                        style={{
                          width: "150px",
                          marginTop: 10,
                          marginLeft: 10,
                        }}
                      >
                        Activate
                      </Button>
                    </>
                  )}
                  <span> </span>
                  <Button
                    variant="danger"
                    onClick={() => this.props.actions.deleteAction(cellData)}
                    style={{ width: "150px", marginTop: 10, marginLeft: 10 }}
                  >
                    Delete
                  </Button>
                  {this.props.qr_generate ? (
                    <Button
                      variant="warning"
                      onClick={() => this.props.actions.qrGenerate(cellData)}
                      style={{ width: "150px", marginTop: 10, marginLeft: 10 }}
                    >
                      QR
                    </Button>
                  ) : (
                    ""
                  )}
                </React.Fragment>,
                td
              ),
          },
        ],
      });
    } else {
      this.$el.DataTable({
        data: this.props.data,
        columns: this.props.columns,
      });
    }
    this.setState({ loading: false });
  }
  render() {
    return (
      <div>
        {this.props.is_order !== true
          ? this.props.tableType !== "tableData" &&
            this.props.is_active === true && (
              <Row style={{ flexDirection: "row-reverse" }}>
                <Button
                  vairent="primary"
                  onClick={this.props.actions.addAction}
                >
                  Add
                </Button>
              </Row>
            )
          : ""}
        <hr />
        <Row>
          <Col className="table-responsive">
            <table
              style={{
                backgroundColor: "#fff",
                overflow: "hidden",
                borderRadius: "4px",
              }}
              className="display table table-hover table-striped table-bordered"
              width="100%"
              ref={(el) => (this.el = el)}
            ></table>
          </Col>
        </Row>
      </div>
    );
  }
}
