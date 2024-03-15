# MODI-Jekyll-Theme

Welcome to your new Jekyll theme! In this directory, you'll find the files you need to be able to package up your theme into a gem. Put your layouts in `_layouts`, your includes in `_includes`, your sass files in `_sass` and any other assets in `assets`.

To experiment with this code, add some sample content and run `bundle exec jekyll serve` – this directory is setup just like a Jekyll site!

TODO: Delete this and the text above, and describe your gem

## Installation

Add this line to your Jekyll site's `Gemfile`:

```ruby
gem "MODI-Jekyll-Theme"
```

And add this line to your Jekyll site's `_config.yml`:

```yaml
theme: MODI-Jekyll-Theme
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install MODI-Jekyll-Theme

## Usage

TODO: Write usage instructions here. Describe your available layouts, includes, sass and/or assets.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/[USERNAME]/MODI-Jekyll-Theme. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## Development

To set up your environment to develop this theme, run `bundle install`.

Your theme is setup just like a normal Jekyll site! To test your theme, run `bundle exec jekyll serve` and open your browser at `http://localhost:4000`. This starts a Jekyll server using your theme. Add pages, documents, data, etc. like normal to test your theme's contents. As you make modifications to your theme and to your content, your site will regenerate and you should see the changes in the browser after a refresh, just like normal.

When your theme is released, only the files in `_layouts`, `_includes`, `_sass` and `assets` tracked with Git will be bundled.
To add a custom directory to your theme-gem, please edit the regexp in `MODI-Jekyll-Theme.gemspec` accordingly.

## License

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

# MISC

## SQL JS
We use [sql js](https://sql.js.org/#/) to run sqlite3 in the browser ([repo](https://github.com/sql-js/sql.js)). However they do no support FTS5 by default. You need to compile their code yourself with FTS5 enabled.
Here are the instruction to do this, I'm writing this down because their documentation is quite bad (written on 15-03-2024):

You will need [*make*](https://en.wikipedia.org/wiki/Make_(software)) and [*emscripten*](https://emscripten.org/docs/getting_started/downloads.html).

Version make: latest (I used 4.3)\
Version emscripten: 3.1.51 (not the latest version)

install emscripten and set path to emcc
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
./emsdk install 3.1.51
./emsdk activate 3.1.51
export PATH=<path to emsdk dir>/upstream/emscripten/:$PATH
```

Check emscripten version
```bash
emcc --version
```
Clone sql js repo
```bash
cd ~
git clone https://github.com/sql-js/sql.js.git
cd sql.js
```

Open the makefile in the directory and add **-DSQLITE_ENABLE_FTS5** to **SQLITE_COMPILATION_FLAGS**\
It should look something like this:

```
SQLITE_COMPILATION_FLAGS = \
	-Oz \
	-DSQLITE_OMIT_LOAD_EXTENSION \
	-DSQLITE_DISABLE_LFS \
	-DSQLITE_ENABLE_FTS3 \
	-DSQLITE_ENABLE_FTS3_PARENTHESIS \
	-DSQLITE_THREADSAFE=0 \
	-DSQLITE_ENABLE_NORMALIZE \
	-DSQLITE_ENABLE_FTS5
```
Build new executables:
```bash
make
```
The new compiled files are in /dist:\
You need sql-wasm.wasm

You can now uninstall all the other garbage you just installed

