@leftpanel @S9f53a1d1
Feature: Left Panel

  @format @select-format
  Scenario Outline: Select format
    Given I go to main page
    And I select format <format>
    Then I see it's size within the panel <format>
    And it updates on zoom <format>
  Examples:
    | format |
    | Square |
    | Full size |

  @select @select-text-size
  Scenario Outline: Select text size
    Given I go to main page
    And I select text size <size>
    Then I see it's updated within the viz <size>

  Examples:
    | size |
    | 200% |
    | 50% |

  @text-slider @T712e3366
  Scenario: Select text size with slider
    Given I go to main page
    When I toggle text slider
    Then text disappear
    And I toggle text slider
    Then text reapear

  @collide-switch @T895f83fe
  Scenario: Select text collision
    Given I go to main page
    When I toggle text collision
    Then text collide accordingly false
    And I toggle text collision
    Then text collide accordingly true

  @snap-switch @T62cf2ace
  Scenario: Select snapping
    Given I go to main page
    When I toggle snapping
    Then snapping toggles accordingly true
    And I toggle snapping
    Then snapping toggles accordingly false
