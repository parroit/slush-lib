#Slush-lib

> slush node + mocha + chai + github + travis + npm


**Contributor:** [@JoelCox](http://github.com/joelcoxokc)

## Getting Started

### Installation

Install `slush-lib` globally:

```bash
$ npm install -g slush-lib
```

Remember to install `gulp` and `slush` globally as well, if you haven't already:

```bash
$ npm install -g gulp slush
```

### Usage

Create a new folder for your project:

```bash
$ mkdir my-slush-lib
```

Run the generator from within the new folder:

```bash
$ cd my-slush-lib && slush lib
```

##Features

slush-lib is a great tool for quickly creating a new library.
This Generator comes with the following out of the box

 -  Testing integration using **MochaJS** and **Chai**.
 - **Github** account integration.
 - **Travis** account Integration.
 - **npm** account integration.
****

#Sub-Generators

##Module Sub-Generator


The module sub-generator will create a new node-module in the requested directory. You will also be prompted for the type of pattern you would like to use in the module.

**The Module Sub-Generator also comes with a test file in tests/ **

In order to create a new module run the following command.

```bash
slush lib:module <name>
```

###Prompts
<table>
<tr>

<td><a>Path</a></td><td>Will set the path of the module.</td>
</tr>
<tr><td><a>Pattern</a></td>
<td>Set your desired inheritance Pattern.<a> Class, Module, Singleton</a>  </td></tr>

<tr><td><a>Private</a></td>
<td>Dynamically create private methods within the module.</td></tr>

<tr><td><a>Public</a></td>
<td>Dynamically create public methods that will be used as an API..</td></tr>
</table>

**NOTE**: When setting the **Private** or **Public** Methods,
if more than one, please comma separate each. For Example:
```bash
[?] Private Methods? one,two,three
```


###Flags
You can bypass the prompts by simply passing --flags instead.


```bash
lib:module <name>  --path --pattern --private --public
```
**`--Path`**: Will set the path where you would like to module to be placed.
```bash
--path ./lib/somePath
```

**`--Pattern`**: Will Set the Pattern Type.
```bash
--pattern
```


**Private**: Will will create private functions within your module
**NOTE** If you are passing multiple function names, please comma separate them with **NO SPACES**

```bash
--private one,two,three
```

**Public**: Will will create Public API functions for your module.
**NOTE** If you are passing multiple function names, please comma separate them with **NO SPACES**

```bash
--public one,two,three
```


## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

Slush does not contain anything "out of the box", except the ability to locate installed slush generators and to run them with liftoff.

To find out more about Slush, check out the [documentation](https://github.com/klei/slush).

## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/joelcoxokc/slush-lib/blob/master/CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/joelcoxokc/slush-lib/issues).

## License

The MIT License

Copyright (c) 2014, Joel Cox

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.