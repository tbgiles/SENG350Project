"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var errorhandler_1 = __importDefault(require("errorhandler"));
var index_1 = require("../routes/index");
/**
 * The server.
 *
 * @class Server
 */
var Server = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    function Server() {
        //create expressjs application
        this.app = express_1.default();
        //configure application
        this.config();
        //add routes
        this.routes();
        console.log("Server is now running");
    }
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    Server.bootstrap = function () {
        return new Server();
    };
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    Server.prototype.config = function () {
        //add static paths
        this.app.use(express_1.default.static("public"));
        //configure pug
        this.app.set("views", path_1.default.join(__dirname, "../../views"));
        this.app.set("view engine", "pug");
        //mount logger
        this.app.use(morgan_1.default("dev"));
        //mount json form parser
        this.app.use(body_parser_1.default.json());
        //mount query string parser
        this.app.use(body_parser_1.default.urlencoded({
            extended: true
        }));
        //mount cookie parser middleware
        this.app.use(cookie_parser_1.default("SECRET_GOES_HERE"));
        // catch 404 and forward to error handler
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        //error handling
        this.app.use(errorhandler_1.default());
    };
    /**
     * Create and return Router.
     *
     * @class Server
     * @method routes
     * @return void
     */
    Server.prototype.routes = function () {
        var router;
        router = express_1.default.Router();
        index_1.IndexRoute.create(router);
        //use router middleware
        this.app.use(router);
    };
    return Server;
}());
exports.Server = Server;
