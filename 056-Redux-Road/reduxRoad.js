const initialWagonState = {
    supplies: 100,
    distance: 0,
    days: 0
  };
  
  const someState = (state = initialWagonState, action) => {
    switch (action.type) {
      case 'gather': {
        return {
          ...state,
          supplies: state.supplies + 15,
          distance: state.distance,
          days: state.days + 1
        };
      }
  
      case 'travel': {
        return {
          ...state,
          supplies: state.supplies - (20*action.payload) >=0 ? state.supplies - (20*action.payload) : state,
          distance: state.supplies - (20*action.payload) >=0 ? state.distance + (10*action.payload) : state,
          days: state.supplies - (20*action.payload) >=0 ? state.days + action.payload : state
        };
      }
  
      case 'tippedWagon': {
        return {
          ...state,
          supplies: state.supplies - 30,
          distance: state.distance,
          days: state.days + 1
        };
      }
  
  
      default: {
        return state;
      }
    }
  };
  
  let wagon = someState(undefined,{});
  console.log(wagon);
  wagon = someState(wagon,{type:'travel',payload:1});
  console.log(wagon);
  wagon = someState(wagon,{type:'gather'});
  console.log(wagon);
  wagon = someState(wagon,{type:'tippedWagon'});
  console.log(wagon);
  wagon = someState(wagon,{type:'travel',payload:3});
  console.log(wagon);
  wagon = someState(wagon,{type:'travel',payload:2});
  console.log(wagon);