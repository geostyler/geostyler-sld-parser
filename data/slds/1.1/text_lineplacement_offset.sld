<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Simple Text</se:Name>
    <UserStyle>
      <se:Name>Simple Text</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name/>
          <se:TextSymbolizer uom="http://www.opengeospatial.org/se/units/pixel">
            <se:Label>
              <ogc:Literal>myText</ogc:Literal>
            </se:Label>
            <se:LabelPlacement>
              <se:LinePlacement>
                <se:PerpendicularOffset>12</se:PerpendicularOffset>
              </se:LinePlacement>
            </se:LabelPlacement>
          </se:TextSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
