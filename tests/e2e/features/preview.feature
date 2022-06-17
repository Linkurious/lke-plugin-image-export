Feature: Preview

  @open-close
  Scenario Outline: Open Close outside
    Given I go to main page
    When I click preview
    Then I see the preview modal
    When I click outside the modal
    Then the modal closes
  Examples:
    | dummy |
    | dummy |

  @open-close
  Scenario Outline: Open Close button
    Given I go to main page
    When I click preview
    Then I see the preview modal
    When I click the close button
    Then the modal closes
  Examples:
    | dummy |
    | dummy |
