const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./model/User')

/*function initialise(passport, getuserbyemail, getuserbyid){
    const authenticateUser = async (email, password, done) => {
        try {
            console.log(email, password);
            const user = getuserbyemail(email)
            if(user == null){
                return done(null, false, {message: 'No user with that email'});
            }
            const match = await bcrypt.compare(password, user.password);
            if(match){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Password incorrect'});
            }
        } catch (error) {
            console.log(error);
        }
    }

    //passport.use(new localstartegy({usernameField: 'email'}, authenticateUser));
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
          // Match user
          User.findOne({
            email: email
          }).then(user => {
            if (!user) {
              return done(null, false, { message: 'That email is not registered' });
            }
    
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Password incorrect' });
              }
            });
          });
        })
    );
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
       return done(null, getuserbyid(id));
    }); */
//}

//module.exports = initialise;
module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
        User.findOne({
          email: email
        }).then(user => {
          if (!user) {
              console.log("email not registered")
            return done(null, false, { message: 'That email is not registered' });
          }
  
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
              console.log("password incorrect")
            }
          });
        });
      })
    );
  
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
  };