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

  @zoom
  Scenario Outline: Zoom-in/out
    Given I open preview
    When I click zoomin
    Then Preview zooms in
    And I click zoomout
    Then Preview zooms out
  Examples:
    | dummy |
    | dummy |

  @zoom
  Scenario Outline: Reset zoom
    Given I open preview
    When I click zoomin
    And I click zoomin
    And I click reset
    Then Preview resets zoom
  Examples:
    | dummy |
    | dummy |