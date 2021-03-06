var boardDataView;
var attendantDataView;
var roomDataView;

var boardGrid;
var attedantGrid;
var roomGrid;
var boardData = [];
var attendantData = [];
var roomData = [];
var getAttendantURL1 = "http://192.168.0.101:8090/api/attendant";
var getAttendantURL = "http://DragDrop-env.eba-wrzqbhjj.ap-south-1.elasticbeanstalk.com:8090/api/attendant";

var boardGridColumns = [
    //{id: "boardNum", name: "", field: "boardNum", width: 70, minWidth: 50, },
    {id: "room", name: "Room", field: "room", width: 70, cssClass: "number-field-cl"},
    {id: "type", name: "Type", field: "type", width: 70},
    {id: "vip", name: "VIP", field: "vip", width: 70},
    {id: "status", name: "Status", field: "status", width: 80},
    {id: "station", name: "Stn", field: "station", width: 80},
    {id: "credits", name: "Credits", field: "credits", width: 100, groupTotalsFormatter: totalCreditsFormatter, cssClass: "number-field-cl"},
    {id: "package", name: "Package", field: "package", width: 70},
    {id: "cleanTime", name: "Clean Time", field: "cleanTime", width: 70},
    {id: "multiRoom", name: "Multi Rm", field: "multiRoom", width: 90}
    ];
var attedantGridColumns = [
    {id: "pool", name: "Pool", field: "pool", width: 70, minWidth: 50, cssClass: "number-field-cl"},
    {id: "schedule", name: "Schedule", field: "schedule", width: 70, minWidth: 50},
    {id: "board", name: "Board", field: "board", width: 70, minWidth: 50},
    {id: "role", name: "Role", field: "role", width: 70, minWidth: 50},
    {id: "attendantId", name: "Id", field: "attendantId", width: 70, minWidth: 50, cssClass: "number-field-cl"},
    {id: "attendantName", name: "Name", field: "attendantName", width: 70, minWidth: 150}
    
    ];
var roomGridColumns = [
    {id: "room", name: "Room", field: "room", width: 70, cssClass: "number-field-cl"},
    {id: "type", name: "Type", field: "type", width: 70},
    {id: "vip", name: "VIP", field: "vip", width: 70},
    {id: "status", name: "Status", field: "status", width: 70},
    {id: "station", name: "Stn", field: "station", width: 70},
    {id: "credits", name: "Credits", field: "credits", width: 70, cssClass: "number-field-cl"},
    {id: "package", name: "Package", field: "package", width: 70},
    {id: "cleanTime", name: "Clean Time", field: "cleanTime", width: 70},
    {id: "multiRoom", name: "Multi Rm", field: "multiRoom", width: 70}
    ];
  
  let gridCommonOptions = {
    enableCellNavigation: true,
    editable: false
  };

  $(function(){
    boardGridOnLoad();

    attendantDataView = new Slick.Data.DataView({
        inlineFilters: true
      });
    attedantGrid = new Slick.Grid("#attendantGrid", attendantDataView, attedantGridColumns, gridCommonOptions);
    wireTheEvents(attedantGrid, attendantDataView, "attendantGrid");
    loadAttendantData(50);

    roomDataView = new Slick.Data.DataView({
        inlineFilters: true
      });
    roomGrid = new Slick.Grid("#roomGrid", roomDataView, roomGridColumns, gridCommonOptions);
    wireTheEvents(roomGrid, roomDataView, "roomGrid");
    loadRoomData(50);
      
  });
  
  function boardGridOnLoad()
  {
    let boardGroupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
    boardDataView = new Slick.Data.DataView({
      groupItemMetadataProvider: boardGroupItemMetadataProvider,
      inlineFilters: true
    });
    boardGrid = new Slick.Grid("#boardGrid", boardDataView, boardGridColumns, gridCommonOptions);
    boardGrid.registerPlugin(boardGroupItemMetadataProvider);
    
    setBoardGrouping();
    boardGrid.onSelectedRowsChanged.subscribe(function(e, args) {
        let selectedRowNo = args.grid.getSelectedRows()[0];
        //let selectedRowData = boardDataView.getItemByIdx(selectedRowNo);
        //alert(JSON.stringify(selectedRowData));
    });
    boardGrid.onClick.subscribe(handleBoardGridClick);

    wireTheEvents(boardGrid, boardDataView, "boardGrid");
    loadBoardData(100);
  }
  function handleBoardGridClick(e, args)
  {
    var item = this.getDataItem(args.row);
    if (item && item instanceof Slick.Group && $(e.target).hasClass("boardDeleteCls"))
    {
        let buttonId = e.target.id;
        if (buttonId && buttonId.includes("board"))
        {
            let boardId = buttonId.split("-")[1];
            deleteBoardData(boardId);
        }
    }
  }
function setBoardGrouping()
{
    boardDataView.setGrouping({
        getter: "boardNum",
        formatter: function (g) {
            let boardDeleteBtn = "<button id='board-" + g.value + "' class='boardDeleteCls'> Delete Board </button>";
            let boardNumberSpan = "<span style='float:left'>" + "Board Number : " + g.value + " "+ boardDeleteBtn +"</span>";
            let attedantSpan = "<span id='attendantSpan-"+ g.value +"' style='float:left; margin-left: 120px;'>"
             + "Attendant - "+ g.value + "</span>";
            let totalRoomsSpan = "<span style='float:right'>" + "Total Rooms : " + g.count + "</span>";
            
            let boardFormatter = boardNumberSpan + attedantSpan + totalRoomsSpan;
            return "<span style='font-weight: bold;'>" + boardFormatter + "</span>";
        },
        aggregators: [
          new Slick.Data.Aggregators.Sum("credits")
        ],
        aggregateCollapsed: true,
        lazyTotalsCalculation: true
      });
}
  function loadBoardData(count) {
      let boardArr = [500123, 500124, 500125, 500126, 500127,
        500128, 500129, 500130,500131, 500132, 500133, 500134, 500135];
    boardData = [];
    for (let i = 0; i < count; i++) 
    {
      var d = (boardData[i] = {});
      
      d["boardNum"] = boardArr[Math.round(Math.random() * 10)];
      d["id"] = "id-" + i + "-" + d["boardNum"];
      d["room"] = Math.floor(Math.random()*(999-100+1)+100);
      d["type"] = "KING";
      d["vip"] = "";
      d["status"] = "OD";
      d["station"] = "1A";
      d["credits"] = 2;
      d["package"] = "DSOC";
      d["cleanTime"] = "12:00";
      d["multiRoom"] = "";
    }

    updateGridData(boardDataView, boardData);
  }
  function loadAttendantData(count) 
  {
    attendantData = [];
    let bError = false;

    $.ajax({
      url: getAttendantURL,
      success: function( response ) {
        attendantData = response;
      },
      error : function(e){
        bError = true;
      }
    });    
    setTimeout(function(){
      if (bError)
      {
        for (let i = 0; i < count; i++) 
        {
          var attendantD = (attendantData[i] = {});
      
          attendantD["id"] = "id_" + i;
          attendantD["pool"] = 0;
          attendantD["schedule"] = "";
          attendantD["board"] = "";
          attendantD["role"] = "R";
          attendantD["attendantId"] = Math.floor(Math.random()*(9999-1000+1)+1000);;
          attendantD["attendantName"] = "Attendant Name";
        }
      }
      updateGridData(attendantDataView, attendantData);
    },2000);
  }
  function loadRoomData(count) {
    roomData = [];
    for (let i = 0; i < count; i++) 
    {
      var roomD = (roomData[i] = {});
  
      roomD["id"] = "id_" + i;
      roomD["room"] = Math.floor(Math.random()*(999-100+1)+100);
      roomD["type"] = "KING";
      roomD["vip"] = "";
      roomD["status"] = "OD";
      roomD["station"] = "1A";
      roomD["credits"] = 2;
      roomD["package"] = "DSOC";
      roomD["cleanTime"] = "12:00";
      roomD["multiRoom"] = "";
    }

    updateGridData(roomDataView, roomData);
  }

  function wireTheEvents(grid, dataView, gridId)
  {
    if (null != dataView && null != grid)
    {
        dataView.onRowCountChanged.subscribe(function (e, args) {
            grid.updateRowCount();
            grid.render();
            if (gridId == "boardGrid")
            {
              getAllBoardsCount(dataView);
            }
          });
        
          dataView.onRowsChanged.subscribe(function (e, args) {
          grid.invalidateRows(args.rows);
          grid.render();
        });
        
        grid.setSelectionModel(new Slick.RowSelectionModel());
        registerDragNDrop(grid, dataView, gridId);
    }
  }
  function getAllBoardsCount(dataView)
  {
    if (dataView)
    {
      let allBoard = [];
      let allRowsData = dataView.getItems();
      for (row of allRowsData)
      {
        allBoard.push(row.boardNum);
      }
      allBoard = $.unique(allBoard);
      $("#totalBoardSpan").text("Total Boards : " + allBoard.length);
    }
  }
  function registerDragNDrop(grid, dataView, gridId)
  {
      var draggedRows = null;
      var droppedRows = null;
      grid.onDragInit.subscribe(function (e, dd) {
        // prevent the grid from cancelling drag'n'drop by default
        e.stopImmediatePropagation();
      });
      grid.onDragStart.subscribe(function (e, dd) {
        var cell = grid.getCellFromEvent(e);
        draggedRows = grid.getDataItem(cell.row);
        let dragText = "";
        if (draggedRows["__group"])
        {
          let attendantSpanId = "attendantSpan-" + draggedRows.groupingKey;
          if (e.target.id == attendantSpanId)
          {
            if (Slick.GlobalEditorLock.isActive()) {
              return;
            }
            e.stopImmediatePropagation();
            dd.mode = "validElement";
            dragText = "Selected Attendant : " + $("#"+attendantSpanId).text();
          }
          else
          {
            return;
          }
        }
        else
        {
          dd.row = cell.row;
        
          if (Slick.GlobalEditorLock.isActive()) {
            return;
          }

          e.stopImmediatePropagation();
          dd.mode = "validElement";
      
          var selectedRows = grid.getSelectedRows();
      
          if (!selectedRows.length || $.inArray(dd.row, selectedRows) == -1) {
            selectedRows = [dd.row];
            grid.setSelectedRows(selectedRows);
          }
      
          dd.rows = selectedRows;
          dd.count = selectedRows.length;
          
          switch(gridId)
          {
            case "attendantGrid":
            {
              dragText = "Selected Attendant : " + draggedRows.attendantId + " - " + draggedRows.attendantName;
              break;
            }
            case "roomGrid":
            case "boardGrid":
            {
              dragText = "Selected Room(s) : " + draggedRows.room;
              break;
            }
          }
        }
        
        var proxy = $("<span></span>")
            .css({
              position: "absolute",
              display: "inline-block",
              padding: "4px 10px",
              background: "#e0e0e0",
              border: "1px solid gray",
              "z-index": 99999,
              "-moz-border-radius": "8px",
              "-moz-box-shadow": "2px 2px 6px silver"
            })
            .text(dragText)
            .appendTo("body");
    
        dd.helper = proxy;

        return proxy;
      });
    
      grid.onDrag.subscribe(function (e, dd) {
        if (dd.mode != "validElement") {
          return;
        }
        dd.helper.css({top: e.pageY + 5, left: e.pageX + 5});
      });
    
      grid.onDragEnd.subscribe(function (e, dd) {
        var cell = grid.getCellFromEvent(e);
        console.log('gridId='+gridId);
        if (cell)
        {
          droppedRows = grid.getDataItem(cell.row);
          if (draggedRows.id != droppedRows.id)
          {
              let droppedBoardNum = droppedRows.boardNum;
              draggedRows.boardNum = droppedBoardNum;
              dataView.deleteItem(draggedRows.id);
              dataView.insertItem(cell.row, draggedRows);
              grid.setSelectedRows([cell.row]);
          }
        }
        if (dd.mode != "validElement") {
          return;
        }

        dd.helper.remove();
      });
  }

  function updateGridData(dataView, data)
  {
    if (null != dataView)
    {
        dataView.beginUpdate();
        dataView.setItems(data);
        dataView.endUpdate();
    }
  }
function deleteBoardData(boardId)
{
   let allGridData = boardDataView.getItems();
   let tempDeleteRowIds = [];
   if (null != allGridData)
   {
       for(let i = 0; i < allGridData.length; i++)
       {
         let tempBoardData = allGridData[i];
         if (null != tempBoardData && tempBoardData.boardNum == boardId)
         {
            tempDeleteRowIds.push(tempBoardData.id);
         }
       }
   }
   if (tempDeleteRowIds.length > 0)
   {
     for(let i = 0; i < tempDeleteRowIds.length; i++)
      {
        boardDataView.deleteItem(tempDeleteRowIds[i]);
      }  
   }
   setBoardGrouping();
}
  function expandAll()
  {
    boardDataView.expandAllGroups();
  }
  function collapseAll()
  {
    boardDataView.collapseAllGroups();
  }

  function totalCreditsFormatter(totals, columnDef) 
  {
    var val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
      return "Total Credits: " + val;
    }
    return "";
  }
 let boardNumGlobal = 500135;
  function addBoardCB()
  {
    boardNumGlobal = boardNumGlobal + 1;
    let rowId = "id-" + Math.round(Math.random() * 30) + "-" + boardNumGlobal;
    let newBoard = {id: rowId, boardNum : boardNumGlobal};
    boardDataView.addItem(newBoard);
    boardDataView.refresh();
  }
  function deleteAllBoardCB()
  {
    boardDataView.setItems([]);
  }