import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { fetchCartData } from './store/cart-actions';
import { uiActions } from './store/ui-slice';

let isInitial = true;


function App() {

  const cartIsVisible = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch])

  useEffect(() => {

    const sendCartData = async () => {

      dispatch(
        uiActions.showNotification({
          status: 'pending',
          title: 'Sending...',
          message: 'Sending cart data!'
        })
      );

      const response = await fetch('https://http-react-8a679-default-rtdb.firebaseio.com/cart.json', {
        method: 'PUT',
        body: JSON.stringify({items:cart.items, totalQuantity: cart.totalQuantity})
      });

      if (!response.ok) {
        throw new Error('Sending cart data failed');
      }

      //const responseData = await response.json();
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data succesfully!'
        })
      );
    }

    if (isInitial) {
      isInitial = false;
      return;
    }

    if (cart.changed) {
      sendCartData()
      .catch((err) => {
        dispatch(
          uiActions.showNotification({
            status: 'error',
            title: 'Error!',
            message: 'Sending cart data failed!'
          })
        );
      })
    }

  }, [cart, dispatch]);

  return (
    <>

      {notification
        && (<Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />)}
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
