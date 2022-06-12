import React, { useContext, useEffect, useReducer } from 'react'
import axios from "axios";
import { Store } from '../../Store';
import getError from '../../utils';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import {Chart} from 'react-google-charts';
import Messagebox from '../../components/MessageBox';
import { Card, Col, Row } from 'react-bootstrap';


const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST' :
      return {...state, loading: true}
    case 'FETCH_SUCCES':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      }
    case 'FECTH_FAIL':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
      default :
        return state
  }
}

export default function Dashboard() {

  const [{loading, error, summary}, dispatch  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {state} =  useContext(Store);
  const {userInfo} = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data} = await axios.get('/api/orders/summary', {
          headers: {authorization: `Bearer ${userInfo.token}`}
        });
        dispatch({type: 'FETCH_SUCCES', payload: data})
      } catch(err) {
        dispatch({type: 'FECTH_FAIL', payload: getError(err)})
      }
    } 
    fetchData()
  }, [userInfo]);


  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1 className='mb-4'>Dashboard</h1>
      {loading 
        ?
        (<LoadingBox />) : error 
        ? 
        (<Messagebox variant='danger'>{error}</Messagebox>)
        : (
          <div>
            <Row>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Useri</Card.Title>
                    <Card.Text>
                      <b>
                        {summary.users && summary.users[0] ? 
                          summary.users[0].numUsers : 0
                        }
                    </b>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Comenzi</Card.Title>
                    <Card.Text>
                      <b>
                        {summary.orders && summary.orders[0] ? 
                          summary.orders[0].numOrders : 0
                        }
                    </b>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Vinzari totale</Card.Title>
                    <Card.Text>
                      <b>
                        {summary.orders && summary.orders[0] ? 
                          summary.orders[0].totalSales : 0
                        } RON
                    </b>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className='my-3 pt-3'>
              <h2 className='mb-2'>Vinzari</h2>
              {summary.dailyOrders.length === 0 ? (
                <Messagebox>Nu sunt vinzari!</Messagebox>
              ) : (
                <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[['Date','Vinzari'], ...summary.dailyOrders.map((x) => [x._id, x.sales])]}
              >
                </Chart>
              )}

            </div>
            <div className='my-3 pt-3'>
              <h2 className='mb-2'>Categorii</h2>
              {summary.productCategories.length === 0 ? (
                <Messagebox>Nu sunt Categorii</Messagebox>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="PieChart"
                  loader={<div>Loading Chart...</div>}
                  data={[['Produse','Categorii'], ...summary.productCategories.map((x) => [x._id, x.count])]}
              >
                </Chart>
              )}

            </div>
          </div>
        )
      }
    </div>
  )
}
  