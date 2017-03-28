<<<<<<< .merge_file_tDkptE
import ready from 'lego-starter-kit/utils/polyfill';
import App from './App';
=======
import polyfill from 'lego-starter-kit/utils/polyfill';
// import App from 'lego-starter-kit/CoreApp'
import App from 'lego-starter-kit/ReactApp';
>>>>>>> .merge_file_IHGMir
import config from './config';
ready();
const app = new App({ config });
app.run().then(() => {
  console.log(`🎃  The server is running at http://127.0.0.1:${app.config.port}/ [${global.timing()}ms]`);
});
