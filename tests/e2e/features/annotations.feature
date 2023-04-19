Feature: Annotations

  @annotations-arrow
  Scenario Outline: Draw an arrow
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains an arrow from <x1>,<y1> to <x2>,<y2>
  Examples:
    | x1 | y1 | x2  | y2  | name | outputFormat |
    | 500 | 500 | 700 | 600 | arrow.svg | svg |

  @annotations-text
  Scenario Outline: Draw a text
    Given I go to main page
    And I select annotation text
    And I draw a text from <x1>,<y1> to <x2>,<y2>
    And I change the text at <x3>,<y3> to "<text>"
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains a text "<text>" at <x1>,<y1> to <x2>,<y2>
  Examples:
    | x1 | y1 | x2  | y2  | x3 | y3 | text | name | outputFormat |
    | 500 | 500 | 700 | 600 | 550 | 550 | Changed text | text.svg | svg |


  @annotations-arrow-direction
  Scenario Outline: Draw an arrow with direction
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I open the arrow settings menu
    And I change the arrow direction to "<direction>"
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains an arrow with direction "<direction>"

  Examples:
    | x1 | y1 | x2  | y2  | direction | name | outputFormat |
    | 500 | 500 | 700 | 600 | head | arrow-head.svg | svg |
    | 500 | 500 | 700 | 600 | both | arrow-both.svg | svg |
    | 500 | 500 | 700 | 600 | none | arrow-none.svg | svg |

  @annotations-arrow-color
  Scenario Outline: Draw an arrow with color
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I open the arrow settings menu
    And I change the arrow color to "<color>"
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains an arrow with color "<color>"
  Examples:
    | x1 | y1 | x2  | y2  | color | name | outputFormat |
    | 500 | 500 | 700 | 600 | 2 | arrow-color-2.svg | svg |
    #| 500 | 500 | 700 | 600 | 4 | arrow-color-4.svg | svg |
    | 500 | 500 | 700 | 600 | 6 | arrow-color-6.svg | svg |

  @annotations-arrow-width
  Scenario Outline: Draw an arrow with width
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I open the arrow settings menu
    And I change the arrow width to "<width>"
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains an arrow with width "<width>"
  Examples:
    | x1 | y1 | x2  | y2  | width | name | outputFormat |
    | 500 | 500 | 700 | 600 | 1 | arrow-width-1.svg | svg |
    #| 500 | 500 | 700 | 600 | 2 | arrow-width-2.svg | svg |
    #| 500 | 500 | 700 | 600 | 3 | arrow-width-3.svg | svg |

  @annotations-arrow-multiple
  Scenario Outline: Draw multiple arrows
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I select annotation arrow
    And I draw an arrow from <x3>,<y3> to <x4>,<y4>
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains <num> arrows
  Examples:
    | x1 | y1 | x2  | y2  | x3 | y3 | x4 | y4 | name | outputFormat | num |
    | 500 | 500 | 700 | 600 | 550 | 600 | 700 | 200 | arrow-multiple.svg | svg | 2 |


  @annotations-text-background
  Scenario Outline: Draw a text with background
    Given I go to main page
    And I select annotation text
    And I draw a text from <x1>,<y1> to <x2>,<y2>
    And I change the text at <x3>,<y3> to "<text>"
    And I select text at <x3>,<y3>
    And I open the text settings menu
    And I change the text background to "<background>"
    And I unselect the text
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains a text "<text>" with background "<background>"
  Examples:
    | x1 | y1 | x2  | y2  | x3 | y3 | text | background | name | outputFormat |
    | 500 | 500 | 700 | 600 | 550 | 550 | Changed text | 3 | text-background-2.svg | svg |
    #| 500 | 500 | 700 | 600 | 550 | 550 | Changed text | 4 | text-background-4.svg | svg |
    | 500 | 500 | 700 | 600 | 550 | 550 | Changed text | 1 | text-background-6.svg | svg |

  @annotations-text-color
  Scenario Outline: Draw a text with color
    Given I go to main page
    And I select annotation text
    And I draw a text from <x1>,<y1> to <x2>,<y2>
    And I change the text at <x3>,<y3> to "<text>"
    And I select text at <x3>,<y3>
    And I open the text settings menu
    And I change the text color to "<color>"
    And I unselect the text
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains a text "<text>" with color "<color>"
  Examples:
    | x1 | y1 | x2  | y2  | x3 | y3 | text | color | name | outputFormat |
    | 500 | 500 | 700 | 600 | 550 | 550 | Changed text | 2 | text-color-2.svg | svg |
    #| 500 | 500 | 700 | 600 | 550 | 550 | Changed text | 4 | text-color-4.svg | svg |


  @annotations-text-font
  Scenario Outline: Draw a text with font
    Given I go to main page
    And I select annotation text
    And I draw a text from <x1>,<y1> to <x2>,<y2>
    And I change the text at <x3>,<y3> to "<text>"
    And I select text at <x3>,<y3>
    And I open the text settings menu
    And I change the text font to "<font>"
    And I unselect the text
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains a text "<text>" with font "<font>"
  Examples:
    | x1 | y1 | x2  | y2  | x3 | y3 | text | font | name | outputFormat |
    | 500 | 500 | 700 | 600 | 550 | 550 | Changed text | 2 | text-font-1.svg | svg |

  @annotations-text-size
  Scenario Outline: Draw a text with size
    Given I go to main page
    And I select annotation text
    And I draw a text from <x1>,<y1> to <x2>,<y2>
    And I change the text at <x3>,<y3> to "<text>"
    And I select text at <x3>,<y3>
    And I open the text settings menu
    And I change the text size to "<size>"
    And I unselect the text
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains a text "<text>" with size "<size>"
  Examples:
    | x1 | y1 | x2  | y2  | x3 | y3 | text | size | name | outputFormat |
    | 500 | 500 | 700 | 600 | 550 | 550 | Changed text | 3 | text-size-1.svg | svg |
