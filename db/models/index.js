import { Movie } from "./Movie.js";
import { Actor } from "./Actor.js";

Movie.belongsToMany(Actor, { through: "MovieActor" });
Actor.belongsToMany(Movie, { through: "MovieActor" });

export { Movie, Actor };
