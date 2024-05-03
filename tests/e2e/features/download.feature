Feature: Download
  @download @downloadpng
  Scenario Outline: Download png
    Given I go to main page
    And I select format <format>
    And I select text size <size>
    And I drag the viz <drag>
    And I set text visibility <textVisible>
    And I set text collision removal <collisionRemoval>
    And I open preview and wait for loading
    And I select background color <background>
    And I select output format <outputFormat>
    When I click download <name> <outputFormat>
    Then image is nice <name>
  Examples:
    | name            | outputFormat | format    | drag   | size | textVisible | collisionRemoval | background |
    | square-1.png    |     png      |  Square   | false  | 50%  |  true       |   true           |  true      |
    | square-2.png    |     png      |  Square   | true   | 200% |  true       |   false          |  false     |
    | square-3.png    |     png      |  Square   | false  | 100% |  false      |   true           |  true      |


  @download @downloadsvg
  Scenario Outline: Download svg
      Given I go to main page
      And I select format <format>
      And I select text size <size>
      And I drag the viz <drag>
      And I set text visibility <textVisible>
      And I set text collision removal <collisionRemoval>
      And I open preview and wait for loading
      And I select background color <background>
      And I select output format <outputFormat>
      When I click download <name>  <outputFormat>
      Then image is nice <name>
  Examples:
    | name                | outputFormat | format    | drag   | size | textVisible | collisionRemoval | background |
    | square-1-svg.png    |     svg      |  Square   | false  | 50%  |  true       |   true           |  true      |
    | square-2-svg.png    |     svg      |  Square   | true   | 200% |  true       |   false          |  false     |
    | square-3-svg.png    |     svg      |  Square   | false  | 100% |  false      |   true           |  true      |
