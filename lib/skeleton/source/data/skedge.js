import Skedge from './../../../skedge-interface/skedge.js';

const skedge = Skedge(  false,
                        false,
                        window.location.origin,
                        [ new Date(), 3 ],
                        new Date().toString().match( /\(([A-Za-z\s].*)\)/ )[ 1 ] );

export default skedge;
