import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Home from './components/Home';
import { getUserAuth } from "./actions";
import { connect } from 'react-redux';

function App(props) {
  useEffect(() => {
      props.getUserAuth();
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/home' element={<><Header/><Home/></>}/>
      </Routes>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user, // Assuming you have a 'user' state in your Redux store
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
