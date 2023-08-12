import * as React from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import{
    Typography,
} from '@material-ui/core';
// import data  from './dataSource.json';
import { ColumnsDirective, ColumnDirective, TreeGridComponent, Inject } from '@syncfusion/ej2-react-treegrid';
import { VirtualScroll,Filter, Toolbar,Freeze,Resize, Reorder,Page, Sort, PdfExport, ColumnMenu,ContextMenu } from '@syncfusion/ej2-react-treegrid';
import './sample.css';

// eslint-disable-next-line no-unused-vars
function convertObjectKeyToTableColumnObject(arr, tableData) {
    let resultsArr = [];
    arr.forEach(columnName => {
        let lookUpMap = {}

        tableData.forEach(row => {
            let val = row[columnName];
            lookUpMap[val] = val;
        });

        let obj = {
            field: columnName,
            title: columnName,
            lookup: lookUpMap,
            headerStyle: {
                // backgroundColor: colors.orange[500],
                // color: 'white', 
                fontWeight: 'bold',
                fontSize: 18,
            }
        }

        if (columnName === 'id') {
            obj['cellStyle'] = {
                // backgroundColor: colors.orange[500],
                // color: 'white',
                fontWeight: 'bold',
                fontSize: 18,
            }
        }

        resultsArr.push(obj);
    });
    return resultsArr;
}

export default class App extends React.Component {

     constructor(props) {
        super(props);
        this.settings = { type: 'Multiple' };
       this.filterSettings = { type: 'Excel'  };
        // this.FilterOptions = {
        //     type: 'Excel'
        // };
        this.inputStyle = { width: '150px', display: 'inline-block'};
        this.contextMenuItems = ['Save'];
        this.dateFormat = { type: 'date', format: 'YYYY/MM' };
        // this.rowSelected = this.rowSelected.bind(this);
        // this.onClick = this.onClick.bind(this);
        // this.show = this.show.bind(this);
        // this.hide = this.hide.bind(this);
    }

     // componentDidMount(){
     //   this.rowSelected();
     //   this.show();
     //   this.hide();
     // }

    onClick() {
        const searchText = document.getElementsByClassName('searchtext')[0].value;
        if (this.treegrid) {
            this.treegrid.search(searchText);
        }
    }

     dataBound() {
        if (this.treegrid) {
            this.treegrid.autoFitColumns();
        }
    }

    rowSelected() {
}
     show() {
        if (this.treegrid) {
            this.treegrid.showColumns(this.props.allColumns); // show by HeaderText
        }
    }
    hide() {
        var hiddenColumns=[]
        for (var i=this.props.allColumns.length; i--;) {
           if (this.props.selectedColumns.indexOf(this.props.allColumns[i]) === -1) 
               hiddenColumns.push(this.props.allColumns[i]);
        }

        if (this.treegrid) {
            this.treegrid.hideColumns(hiddenColumns); // hide by HeaderText
        }
    }    
    render() {
        this.rowSelected = this.rowSelected.bind(this);
        this.onClick = this.onClick.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
         const {
            allColumns,
            selectedJobCdrList,
        } = this.props;
          /*Title of the Table*/
       /* let title = `${selectedJob['category']} `;
        if (selectedJob['category'] === 'Location') {
            let valuesArr = selectedJob['query'].split(',');
            let tempString = `Lat: ${valuesArr[0]}, Long: ${valuesArr[1]}, Dist: ${valuesArr[2]}`;
            title += tempString;
        }
        else if (selectedJob['category'] === 'LAC/Cell-ID') {
            let valuesArr = selectedJob['query'].split(',');
            let tempString = `LAC: ${valuesArr[0]}, Cell-ID: ${valuesArr[1]}, Dist: ${valuesArr[2]}`;
            title += tempString;
        }
        else {
            title += selectedJob['query'];
        }*/
        return (
            <div>
                <Typography component='h5' variant='h5'><strong>Tabular Data</strong></Typography>
                <div style={{marginBottom: 8, display: 'flex',justifyContent: 'flex-end'}}>
                    <div className='e-float-input' style={this.inputStyle}>
                    <input type="text" className="searchtext"/>
                    <span className="e-float-line"/>
                    <label className="e-float-text">Search text</label>
                    </div>
                    <ButtonComponent id='search' style={{marginLeft:8, height:'20%' }} onClick={this.onClick}>Search</ButtonComponent>
                </div>
                <ButtonComponent cssClass='e-flat' onClick={this.show}>Show All Records</ButtonComponent>
                <ButtonComponent cssClass='e-flat' onClick={this.hide}>Show Selected Records</ButtonComponent>
                <TreeGridComponent dataSource={selectedJobCdrList}
                 treeColumnIndex={1} 
                 width='100%'
                 allowReordering='true' 
                 idMapping='TaskID'
                 childMapping='subtasks'
                 parentIdMapping='parentID' 
                 pageSettings={this.pageOptions} 
                 dataBound={this.dataBound} 
                 toolbarClick={this.toolbarClick} 
                 toolbar={this.toolbarOptions} 
                 selectionSettings={this.settings} 
                 allowPaging={true} 
                 ref={g => this.treegrid = g} 
                 rowSelected={this.rowSelected} 
                 allowFiltering={true} 
                 allowPdfExport={true}
                 allowResizing={true}
                 showColumnMenu={true}
                 filterSettings={this.filterSettings}
                 allowSorting={true}
                 contextMenuItems={this.contextMenuItems}
                 // enableVirtualization={true}
                 >
             {/*dropdown filter doubt: might have to manually write date in the code*/}
                    <ColumnsDirective>
                                <ColumnDirective type='checkbox' width='50' isFrozen='true'/>
                            {allColumns.map((column)=>{
                                return(
                              <ColumnDirective field={column} width='70' headerText={column} textAlign='Left' />
                                    );
                            })}
                          
                    </ColumnsDirective>
                    <Inject services={[VirtualScroll,Filter,Freeze, Toolbar, Page,Sort, Reorder,ColumnMenu,ContextMenu, Resize, PdfExport]}/>
              </TreeGridComponent>
      </div>
      );
    }
}